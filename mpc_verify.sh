#!/bin/bash

if ! docker --version; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

mkdir -p ./params
mkdir -p ./params/verify
mkdir -p ./radix

echo "Downloading param files..."
if [ ! -f ./params/deposit ]; then
  curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/deposit --output params/deposit 2> /dev/null
  echo "Deposit param file downloaded..."
fi
if [ ! -f ./params/single_transfer ]; then
  curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/single_transfer --output params/single_transfer 2> /dev/null
  echo "Single transfer param file downloaded..."
fi
if [ ! -f ./params/double_transfer ]; then
  curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/double_transfer --output params/double_transfer 2> /dev/null
  echo "Double transfer param file downloaded..."
fi
if [ ! -f ./params/withdraw ]; then
  curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/withdraw --output params/withdraw 2> /dev/null
  echo "Withdraw param file downloaded..."
fi

echo "Downloading radix files..."
if [ ! -f ./radix/deposit ]; then
  curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix/deposit --output radix/deposit 2> /dev/null
  echo "Deposit radix file downloaded..."
fi
if [ ! -f ./radix/single_transfer ]; then
  curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix/single_transfer --output radix/single_transfer 2> /dev/null
  echo "Single transfer radix file downloaded..."
fi
if [ ! -f ./radix/double_transfer ]; then
  curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix/double_transfer --output radix/double_transfer 2> /dev/null
  echo "Double transfer radix file downloaded..."
fi
if [ ! -f ./radix/withdraw ]; then
  curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix/withdraw --output radix/withdraw 2> /dev/null
  echo "Withdraw param radix downloaded..."
fi

docker build  --build-arg SCRIPT=verify  -t verify .
docker run --name verify_container verify 
docker cp verify_container:/app/params/verify ./params
docker rm -f verify_container

rm -rf ./params ./radix
