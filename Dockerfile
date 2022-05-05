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

ENV NAME=$NAME
ENV ENTROPY=$ENTROPY
ENV ITERATIONS=$ITERATIONS

ENV MPC_PARAMS_URL=https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params
ENV RADIX_FILES_URL=https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix

COPY . .
COPY --from=builder /app/ZoKrates/zokrates_stdlib/stdlib /stdlib
COPY --from=builder /app/ZoKrates/target/release/zokrates /zokrates


RUN mkdir -p params/out
RUN mkdir -p radix
RUN mkdir -p circuits


ARG SCRIPT
ENV SCRIPT=$SCRIPT

RUN curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/deposit --output params/deposit 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/single_transfer --output params/single_transfer 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/double_transfer --output params/double_transfer 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params/withdraw --output params/withdraw 2> /dev/null

RUN if [ "$SCRIPT" = "verify" ]; then \
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix/deposit --output radix/deposit 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix/single_transfer --output radix/single_transfer 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix/double_transfer --output radix/double_transfer 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix/withdraw --output radix/withdraw 2> /dev/null ; \
    fi

RUN if [ "$SCRIPT" = "verify" ]; then \
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/compiled_circuits/deposit_out --output circuits/deposit_out 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/compiled_circuits/single_transfer_out --output circuits/single_transfer_out 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/compiled_circuits/double_transfer_out --output circuits/double_transfer_out 2> /dev/null &&\
    curl https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/compiled_circuits/withdraw_out --output circuits/withdraw_out 2> /dev/null ; \
    fi

RUN npm ci
ENV PATH=$PATH:/

CMD npm run $SCRIPT
