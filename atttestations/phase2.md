# Hermez Network Phase2 ceremony finalization (4th bootstrap)

During the last weeks we have been running the phase2 of the Polygon Nightfall trusted setup
ceremony.

This phase2 was run on 4 circuits:

- deposit: Circuit used to deposit funds.
- single_transfer: Circuit used to spend a single commitment
- double_transfer: Circuit used to spend two commitments
- withdraw: Circuit used to withdraw funds.

This ceremony was run by 3 trusted individuals from the community:

- Darko
- [Baylina](https://keybase.io/jbaylina)
- Brody

<!-- After the contributions, the b2sum of the param files resulting from the last contributions are:

#### deposit.param


#### single_transfer.param


#### double_transfer.param


#### withdraw.param -->

You can see the details of the ceremony
[here](https://github.com/maticnetwork/nightfall_phase2ceremony).

Before calculating the final param file, we will apply a random beacon to the four circuits.

Notice that according to
[this](https://electriccoin.co/blog/reinforcing-the-security-of-the-sapling-mpc/), a random beacon
might not be strictly necessary. Nevertheless, we consider it best practise to do so.

For this, we will apply the block hash of block number 14718411 of the ethereum main chain, which is
expected to be mined on Thursday May 05 2022 17:48:31 GMT+0100. The transaction that has sent by
[Duncan Westland](https://github.com/Westlad) stating this block number is
[0xd42eff8e34aa9227cdceb12daf1d868b3dec025ac23073cfd103bb697642dbc1](https://etherscan.io/tx/0xd42eff8e34aa9227cdceb12daf1d868b3dec025ac23073cfd103bb697642dbc1)

This document will be hashed and it's hash will be published on the main chain using the same
address.

Finally, the last contribution will be generated this way using the aforementioned provable random
number:

With zokrates 0.7.11:

```bash
zokrates mpc beacon -i params/[last param file] -o params/out/[final param file] -h [entropy source hash] -n 10
```
