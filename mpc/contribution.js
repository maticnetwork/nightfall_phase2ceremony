/* eslint-disable no-await-in-loop */
import childProcess from 'child_process';
import fs from 'fs';

import download from 'download';

const { spawn } = childProcess;

async function contribution(circuitName, random) {
  return new Promise((resolve, reject) => {
    const zokrates = spawn('/app/zokrates', [
      'mpc',
      'contribute',
      '-i',
      `./params/${circuitName}`,
      '-o',
      `./params/out/${circuitName}`,
      '-e',
      random,
    ]);

    zokrates.stderr.on('data', err => {
      reject(new Error(`Setup failed: ${err}`));
    });

    zokrates.on('close', () => {
      resolve();
    });
  });
}

const main = async () => {
  try {
    if (!process.env.ENTROPY) throw new Error('Please provide source of randomness');
    if (!process.env.NAME) throw new Error('What is... your name? What is... your quest?');

    if (!fs.existsSync('./params')) fs.mkdirSync('./params');
    if (!fs.existsSync('./params/out')) fs.mkdirSync('./params/out');

    for (const circuit of ['deposit', 'double_transfer', 'single_transfer', 'withdraw']) {
      console.log(`Generating contribution for ${circuit}...`);
      if (!fs.existsSync(`./params/${circuit}`)) {
        console.log("Downloading params...");
        await download(`${process.env.MPC_PARAMS_URL}/${circuit}`, `./params`);
      }
      await contribution(circuit, process.env.ENTROPY);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
