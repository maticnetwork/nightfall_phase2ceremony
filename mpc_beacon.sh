#!/bin/bash

echo "Enter source of randomness:"
read ENTROPY
ENTROPY=$(echo "${ENTROPY}" | tr -d '[:space:]')

echo "Enter number of iterations:"
read ITERATIONS

echo "Thanks, hang on a bit!"

if ! docker --version; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

mkdir -p out

docker build -t apply_beacon --build-arg SCRIPT=beacon --build-arg ITERATIONS="${ITERATIONS}" --build-arg ENTROPY="${ENTROPY}" .
docker run --name apply_beacon_container apply_beacon
docker cp apply_beacon_container:/app/params/out ./out/params
docker cp apply_beacon_container:/app/log ./out/log
docker rm -f apply_beacon_container

sleep 10
cd out/params
b2sum deposit > ../b2sum/deposit.b2sum
b2sum double_transfer > ../b2sum/double_transfer.b2sum
b2sum single_transfer > ../b2sum/single_transfer.b2sum
b2sum withdraw > ../b2sum/withdraw.b2sum
cd ../../
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
beacon=nightfall.phase2.beacon."${NAME}".${current_time}.tgz
tar -cvzf ${beacon} params/out

echo "Beacon applied" 
