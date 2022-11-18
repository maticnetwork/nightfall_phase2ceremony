#!/bin/bash

if ! docker --version; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

docker build  --build-arg SCRIPT=verify  -t verify .
docker run --name verify_container verify 
docker cp verify_container:/app/params/verify ./params
docker rm -f verify_container
