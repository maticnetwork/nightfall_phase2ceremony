#!/usr/bin/env node
/* eslint-disable prettier/prettier */
const { Command } = require('commander');
const program = new Command();
const promptly = require('promptly');
const applyContrib = require('./src/apply');
const branchName = require('current-git-branch');
const chalk = require('chalk');
let circuits = ['deposit', 'burn', 'tokenise', 'transfer', 'withdraw'];

program.description('CLI').version('0.8.0');

program
  .description('Beacon')
  .argument('[branch]', 'The branch to use in your contribution')
  .argument('[beaconHash]', 'The beacon hash to apply')
  .argument('[circuit]', 'Apply beacon to a specific circuit only')
  .action(async (branch, beaconHash, circuit) => {
    if (!beaconHash) beaconHash = await promptly.prompt('Beacon hash: ');
    if (!branch) branch = branchName();

    if (circuit && circuits.find(el => el === circuit)) circuits = [circuit];
    console.log('Using branch: ', branch);
    console.log('Applying hash', beaconHash);
    console.log('Contributing to circuits:', circuits);

    for (const circuit of circuits) {
      await applyContrib({
        circuit,
        contribData: beaconHash,
        branch,
      });
    }
    console.log(chalk.bgGreen('Thank you for your contribution!'));
    process.exit(0);
  });

program.parse();
