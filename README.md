# Nightfall MPC ceremony (phase 2)
We use phase1 from the perpetual powers of tau. This phase2 is circuit-specific.

To contribute to Nightfall phase 2 ceremony:
```
cd mpc
./mpc_contribute.sh
```

This contribution will download the existent MPC params from a S3 bucket, and will contribute with the source of entropy that is asked in the bash script.
Some suggestions from [zokrates](https://zokrates.github.io/toolbox/trusted_setup.html) for examples of entropy include:
- /dev/urandom from one or more devices
- The most recent block hash
- Randomly mashing keys on the keyboard
After finishing, you should have your new mpc params in `./mpc/nightfall.phase2.contrib.${NAME}.tgz`. Please, send this file to us so that we can continue
with the next contribution.


We will post your contribution in this repository. You can verify that the contribution we post matches the `b2sum` hash in params/out/xxx.b2sum.
