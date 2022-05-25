# Hermez Network Phase2 ceremony finalization (4th bootstrap)

During the last weeks we have been running the phase2 of the Polygon Nightfall trusted setup
ceremony.

This phase2 was run on 4 circuits:

- deposit: Circuit used to deposit funds.
- single_transfer: Circuit used to spend a single commitment
- double_transfer: Circuit used to spend two commitments
- withdraw: Circuit used to withdraw funds.

This ceremony was run by 4 trusted individuals from the community:

1. [Darko Macesic (github ID: dark64)](https://github.com/maticnetwork/nightfall_phase2ceremony/blob/main/atttestations/1_Darko.md)
2. [Jordi Bailyna (github ID: jbaylina)](https://github.com/maticnetwork/nightfall_phase2ceremony/blob/main/atttestations/2_Baylina.md)
3. [Paul Brody (EY Global Blockchain Leader)](https://github.com/maticnetwork/nightfall_phase2ceremony/blob/main/atttestations/3_Brody.md)
4. [Michael Connor (github ID: iAmMichaelConnor)](https://github.com/maticnetwork/nightfall_phase2ceremony/blob/main/atttestations/4_Connor.md)

## Last contributions

After the contributions, the b2sum of the param files resulting from the last contributions are:

#### deposit.param

```
709985a9 a7b6482e 5bbd8d52 23376e88 
5ed8254e 38867c36 80ed60f1 41217ea6 
a814f79d 4bfd1509 c14d5a78 71de9106 
e13a9bc3 ae6db240 5d26fdca 0d21c1b7 
```

#### single_transfer.param


```
a626db0a ae7807cf 85fb6a45 2bbadcb8 
4dc531cf 4bf956cb 496344ce f329e27f 
6f4cdc1c 779bc1f0 5266d360 1c3b6559 
e9860fc1 9799eef6 9b3704ab 6c59796b 
```

#### double_transfer.param

```
9855ce2e e2d9a81b 3d80723d 5f8de036 
8e6140dc ae42c5ea 7d331fee 59aff41f 
79e0ba34 416962ed 078a750d dd3a82f0 
30e270a8 80b82cfa 4aac40ab 0ae67285 
```


#### withdraw.param 

```
3bd30287 950be540 eb092dfe a7c72773 
6f8dce3b 05921baf 0b6ffa5f 68f7d2ef 
7463f4cd e798ddef b314c3e8 8868732e 
e89bc3bc 58398548 90f2ebd1 449c6de3 
```



You can see the details of the ceremony
[here](https://github.com/maticnetwork/nightfall_phase2ceremony).


## Random beacon

Before calculating the final param file, we applied a random beacon to the four circuits.

Notice that according to
[this](https://electriccoin.co/blog/reinforcing-the-security-of-the-sapling-mpc/), a random beacon
might not be strictly necessary. Nevertheless, we considered it best practise to do so.

To add a random beacon, we applied the block hash of block number 14718411 of the ethereum main chain. The transaction that has sent by
[Duncan Westland](https://github.com/Westlad) stating this block number is
[0xd42eff8e34aa9227cdceb12daf1d868b3dec025ac23073cfd103bb697642dbc1](https://etherscan.io/tx/0xd42eff8e34aa9227cdceb12daf1d868b3dec025ac23073cfd103bb697642dbc1). 

The block landed on May 5, 2022 at 05:00:27 PM +UTC and had the blockhash [0x875966a4d290bae914acd733315d1a1cbea3fb2b9fde133a0c6fffa7f726cbe3](https://etherscan.io/block/14718411). This hash was then hashed recursively 1024 times.

The output is 0x144212c1ae36d729307364dcb845a04b9c5f523fe557eb777a910d4ea6cc5a09, which was then used as the last contribution with zokrates 0.7.11
```bash
zokrates mpc beacon -i params/[last param file] -o params/out/[final param file] -h 0x875966a4d290bae914acd733315d1a1cbea3fb2b9fde133a0c6fffa7f726cbe3 -n 10
```
