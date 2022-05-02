/* eslint-disable no-await-in-loop */
import childProcess from 'child_process';
import { circuits } from './utils/constants.js';
import { log, prepareContribution, initFolders } from './utils/index.js';

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

    log(zokrates, resolve, reject)
  });
}

const main = async () => {
  try {
    if (!process.env.ENTROPY) throw new Error('Please provide source of randomness');
    if (!process.env.NAME) throw new Error('What is... your name? What is... your quest?');


    await initFolders();

    for (const circuit of circuits) {
      console.log(`Generating contribution for ${circuit}...`);
      await prepareContribution(circuit);
      await contribution(circuit, process.env.ENTROPY);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
