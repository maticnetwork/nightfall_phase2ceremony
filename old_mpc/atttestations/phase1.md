# Perpetual Powers of Tau Ceremony selection for Polygon Nightfall

We used the first 71 contributions of the Perpetual Powers of Tau Ceremony for BN254 Curve
(Sometimes referred to as BN128).

These 71 contributions are the current contributions available at the writing of this document. You
can find them here:

[https://github.com/weijiekoh/perpetualpowersoftau](https://github.com/weijiekoh/perpetualpowersoftau)

The Blake2b of the 71st contribution response is:

```
    fd607e90 10a84289 81ef636d 798240c9
    dfd49415 460d678a 0dd763d5 ee3ca864
    c63041a7 16f807d3 122cd247 2606a132
    120f014d 1b8ebe16 ba8d4ee2 59a22fea
```

According to [this](https://electriccoin.co/blog/reinforcing-the-security-of-the-sapling-mpc/), a
random beacon might not be strictly necessary. For this reason, and since phase2 is to be applied
for each circuit, we decided to not run the random beacon.

After this, the `preparePhase2` process will be run.
