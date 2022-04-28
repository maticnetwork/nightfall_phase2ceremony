#!/bin/bash

echo "What is your name?"
read NAME

echo "NO ONE EXPECTS THE... Entropy source I'm asking you:"
read ENTROPY

echo "Thanks, hang on a bit!"

if ! docker --version; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

rm -rf ./params/out
docker build -t contribute --build-arg NAME="${NAME}" --build-arg ENTROPY="${ENTROPY}" .
docker run --name contribution_container contribute
docker cp contribution_container:/app/params/out ./params
docker rm -f contribution_container

cd params/out 
b2sum deposit > deposit.b2sum
b2sum double_transfer > double_transfer.b2sum
b2sum single_transfer > single_transfer.b2sum
b2sum withdraw > withdraw.b2sum
cd -
tar -cvzf nightfall.phase2.contrib.${NAME}.tgz params/out
echo "Thank you so much for your contribution to Polygon Nightfall phase2! Please send back the param file nightfall.phase2.contrib.${NAME}.tgz" 
