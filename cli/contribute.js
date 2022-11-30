#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const promptly = require('promptly');
const branchName = require('current-git-branch');
const apply = require('./src/apply');
let circuits = ['deposit', 'burn', 'tokenise', 'transfer', 'withdraw'];

program.name('contribute-util').description('CLI').version('0.8.0');

program
  .description('Contribute')
  .argument('[branch]', 'The branch to use for contribution')
  .argument('[name]', 'Your name')
  .argument('[entropy]', 'The entropy for this contribution')
  .argument('[circuit]', 'Contribute to a specific circuit only')
  .action(async (branch, name, entropy, circuit) => {
    if (!name) name = await promptly.prompt('Your name: ');
    if (!entropy) entropy = await promptly.prompt('Some entropy please:');
    if (!branch) branch = branchName();

    if (circuit && circuits.find(el => el === circuit)) circuits = [circuit];
    console.log('Name:', name);
    console.log('Entropy', entropy);
    console.log('Using branch: ', branch);
    console.log('Contributing to circuits:', circuits);

    await apply({ type: 'contribution', name, contribData: entropy, branch, circuits });
  });

program.parse();
