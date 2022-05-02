/* eslint-disable no-await-in-loop */
import childProcess from 'child_process';
import fs from 'fs';

import download from 'download';

const { spawn } = childProcess;

async function verify(circuitName) {
  return new Promise((resolve, reject) => {
    const zokrates = spawn('/app/zokrates', [
      'mpc',
      'verify',
      '-i',
      `./params/${circuitName}`,
      '-c',
      `./circuits/${circuitName}`,
      '-r',
      `./radix/${circuitName}`,
    ]);

    zokrates.stderr.on('data', err => {
      reject(new Error(`Setup failed: ${err}`));
    });

    zokrates.stdout.on('data', data => {
      console.log(`verify ${circuitName} : ${data}`);
    });

    zokrates.on('close', () => {
      resolve();
    });
  });
}

const main = async () => {
  try {
    if (!fs.existsSync('./params')) fs.mkdirSync('./params');
    if (!fs.existsSync('./params/verify')) fs.mkdirSync('./params/verify');
    if (!fs.existsSync('./circuits/')) throw new Error('Circuits not found');
    if (!fs.existsSync('./radix/')) fs.mkdirSync('./radix');

    for (const circuit of ['deposit', 'double_transfer', 'single_transfer', 'withdraw']) {
      console.log(`Verifying contribution for ${circuit}...`);
      if (!fs.existsSync(`./params/${circuit}`)) {
        console.log("Downloading params...");
        await download(`${process.env.MPC_PARAMS_URL}/${circuit}`, `./params`);
      }
      if (!fs.existsSync(`./radix/${circuit}`)) {
        console.log("Downloading radix...");
        await download(`${process.env.RADIX_FILES_URL}/${circuit}`, `./radix`);
      }
      await verify(circuit);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
