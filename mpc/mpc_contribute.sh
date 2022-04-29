#!/bin/bash

echo "What is your name?"
read NAME
NAME=$(echo "${NAME}" | tr -d '[:space:]')

echo "NO ONE EXPECTS THE... Entropy source I'm asking you:"
read ENTROPY

echo "Thanks, hang on a bit!"

if ! docker --version; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

rm -rf ./params
mkdir -p ./params
mkdir -p ./params/out

echo "Downloading param files..."
curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/deposit --output params/deposit 2> /dev/null
echo "Deposit param file downloaded..."
curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/single_transfer --output params/single_transfer 2> /dev/null
echo "Single transfer param file downloaded..."
curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/double_transfer --output params/double_transfer 2> /dev/null
echo "Double transfer param file downloaded..."
curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/withdraw --output params/withdraw 2> /dev/null
echo "Withdraw param file downloaded..."

docker build -t contribute --build-arg NAME="${NAME}" --build-arg ENTROPY="${ENTROPY}" .
docker run --name contribution_container contribute
docker cp contribution_container:/app/params/out ./params
docker rm -f contribution_container

sleep 10
cd params 
b2sum deposit > out/in_deposit.b2sum
b2sum double_transfer > out/in_double_transfer.b2sum
b2sum single_transfer > out/in_single_transfer.b2sum
b2sum withdraw > out/in_withdraw.b2sum
cd out
b2sum deposit > deposit.b2sum
b2sum double_transfer > double_transfer.b2sum
b2sum single_transfer > single_transfer.b2sum
b2sum withdraw > withdraw.b2sum
cd ../../
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
contribution=nightfall.phase2.contrib."${NAME}".${current_time}.tgz
tar -cvzf ${contribution} params/out

echo "Thank you so much for your contribution to Polygon Nightfall phase2! Please send back the param file ${contribution}" 
