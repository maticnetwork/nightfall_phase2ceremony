#!/bin/bash

echo "What is your name?"
read NAME
NAME=$(echo "${NAME}" | tr -d '[:space:]')

echo "Enter your random private input:"
read ENTROPY

echo "Thanks, hang on a bit!"

if ! docker --version; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

mkdir -p out/b2sum

docker build -t contribute --build-arg SCRIPT=contribute --build-arg NAME="${NAME}" --build-arg ENTROPY="${ENTROPY}" .
docker run --name contribution_container contribute
docker cp contribution_container:/app/params/out ./out/params
docker cp contribution_container:/app/log ./out/log
docker rm -f contribution_container

sleep 10
cd out/params
b2sum deposit > ../b2sum/deposit.b2sum
b2sum double_transfer > ../b2sum/double_transfer.b2sum
b2sum single_transfer > ../b2sum/single_transfer.b2sum
b2sum withdraw > ../b2sum/withdraw.b2sum
cd ../../
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
contribution=nightfall.phase2.contrib."${NAME}".${current_time}.tgz
tar -cvzf ${contribution} out

echo "Thank you so much for your contribution to Polygon Nightfall phase2! Please send back the param file ${contribution}" 
