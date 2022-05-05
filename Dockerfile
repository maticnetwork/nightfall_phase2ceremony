# build zokrates from source for local verify
FROM ghcr.io/eyblockchain/local-zokrates as builder

FROM ubuntu:20.04
WORKDIR /app

RUN apt-get update -y
RUN apt-get install -y netcat curl
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs gcc g++ make

ARG NAME
ARG ENTROPY
ARG ITERATIONS
ARG SCRIPT

ENV NAME=$NAME
ENV ENTROPY=$ENTROPY
ENV ITERATIONS=$ITERATIONS
ENV SCRIPT=$SCRIPT

ENV MPC_PARAMS_URL=https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params
ENV RADIX_FILES_URL=https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix

COPY . .
COPY --from=builder /app/ZoKrates/zokrates_stdlib/stdlib /stdlib
COPY --from=builder /app/ZoKrates/target/release/zokrates /zokrates

RUN npm ci
ENV PATH=$PATH:/

RUN mkdir params/out

CMD npm run $SCRIPT
