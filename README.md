# Nightfall MPC ceremony (phase 2)

## Contribute

We use phase1 from the perpetual powers of tau. This phase2 is circuit-specific.

To contribute to Nightfall phase 2 ceremony:

```
git clone git@github.com:maticnetwork/nightfall_phase2ceremony.git
cd nightfall_phase2ceremony/mpc
./mpc_contribute.sh
```

This contribution will download the existent MPC params from a S3 bucket, and now it is your chance
to provide some randomness to it.

When asked for a random input, you may use one of the following sources of entropy (suggestions from
[zokrates](https://zokrates.github.io/toolbox/trusted_setup.html)):

- `/dev/urandom` from one or more devices
- The most recent block hash
- Randomly mashing keys on the keyboard

After finishing, you should have your new mpc params in `./nightfall.phase2.contrib.${NAME}.tgz`.
Please, send this file to us so that we can continue with the next contribution.

We will post your contribution in this repository. You can verify that the contribution we post
matches the `b2sum` hash in params/out/xxx.b2sum.

## Verify

Verify contributions. You will need to retrieve a copy of the compiled circuits and copy them in
`./circuits` as `deposit`, `single_transfer`, `double_transfer`, `withdraw`.

To perform verification,

```
cd nightfall_phase2ceremony/mpc
./mpc_verify.sh
```

## Testing

You need to install Docker first. Then, to test, just run `npm t` on the root folder.

## Requirements

We use `b2sum`. Please install it if you don't have it installed on your system.

## Other stuff

`ceremony`, `verification` and `beacon` files are to be used internally in order to start, verify
and apply random beacon
