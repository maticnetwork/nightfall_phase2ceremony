# Nightfall3 MPC ceremony (phase 2)

## Contribute

### We use phase1 from the perpetual powers of tau. This phase2 is circuit-specific.

**To contribute to Nightfall phase 2 ceremony, please, do:**

#### 1. Clone repo

```
git clone git@github.com:maticnetwork/nightfall_phase2ceremony.git
```

#### 2. Go to the mpc folder

```
cd nightfall_phase2ceremony/mpc
```

#### 3. Run npm install

```
npm install
```

#### 4. Run npm contribute to give your contribution

```
npm run contribute
```

### The process

What the contribute.js file is doing?

- Ask you to insert your name.
- Ask you for some entropy.
- For each circuit ('deposit', 'withdraw', 'transfer', 'transform', 'tokenise', 'burn'):
  - Get the last contribution from our S3 bucket;
  - We use the contribute function from zkey object of **snarkjs** package that will receive the
    last file, a new file name to be generated, your name and entropy passedm and will generate a
    new contribution file.
  - After that your contribution gonna be send to our server verification that will verify if the
    file is valid. If not you should receive a warn message, otherwise the file will be uploaded to
    our S3 bucket and you will receive a log with all the last contributions.

### Conclusion

After that you contribution should already be added to Nightfall_3 MPC Ceremony.
