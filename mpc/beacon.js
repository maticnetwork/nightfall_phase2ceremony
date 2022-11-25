#!/usr/bin/env node
/* eslint-disable prettier/prettier */
const { zKey } = require('snarkjs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { Command } = require('commander');
const program = new Command();
const promptly = require('promptly');
const chalk = require('chalk');
const Promise = require('promise');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const branchName = require('current-git-branch');
let circuits = ['deposit'];

program.name('beacon').description('CLI').version('0.8.0');

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

    const promises = [];
    circuits.map(async circuit => {
      promises.push(
        new Promise(async (resolve, reject) => {
          s3.listObjects({ Bucket: `mpc2`, Prefix: `${branch}/${circuit}` }, (err, data) => {
            if (err) throw err;
            const contributions = data.Contents.filter(cont => cont.Key !== `${circuit}/`).sort(
              (a, b) => new Date(b.LastModified) - new Date(a.LastModified),
            );
            s3.getObject({ Bucket: `mpc2`, Key: `${contributions[0].Key}` }, async (err, data) => {
              // await zKey.contribute(data.Body, `contribution_${circuit}.zkey`, name, entropy);
              const res = await zKey.beacon(
                data.Body,
                `beacon_${circuit}.zkey`,
                'beacon',
                beaconHash,
                10,
              );

              if (!res) throw Error('Invalid beacon hash');

              const formData = new FormData();
              const testPath = path.join(__dirname, `beacon_${circuit}.zkey`);
              formData.append('contribution', fs.createReadStream(testPath));
              formData.append('name', 'beacon');
              formData.append('circuit', circuit);

              var config = {
                method: 'post',
                url: `http://${
                  branch !== 'main' ? `${branch}.ceremony` : 'ceremony'
                }.polygon-nightfall.io:3333/upload`,
                headers: {
                  ...formData.getHeaders(),
                },
                data: formData,
              };

              axios(config)
                .then(function (response) {
                  console.log(chalk.green('Applied beacon to circuit ' + circuit));
                  console.log(chalk.blue('Verification:'));
                  console.log(chalk.blue(response.data.verification));
                  resolve();
                })
                .catch(function (error) {
                  console.log(chalk.red(error));
                  reject();
                });
            });
          });
        }),
      );
    });

    await Promise.all(promises).then(() => {
      console.log(chalk.bgGreen('Thank you for your contribution!'));
      process.exit(0);
    });
  });

program.parse();
