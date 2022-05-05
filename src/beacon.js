import childProcess from 'child_process';

import config from 'config';
import log from '../utils/index.js';

const { circuits } = config;
const { spawn } = childProcess;

export async function beacon() {
  try {
    if (!process.env.ENTROPY) throw new Error('Please provide source of randomness');
    if (!process.env.ITERATIONS) throw new Error('Please provide number of iterations');

    for (const circuit of circuits) {
      console.log(`Generating beacon for ${circuit}...`);
      await new Promise((resolve, reject) => {
        const zokrates = spawn('zokrates', [
          'mpc',
          'beacon',
          '-i',
          `params/${circuit}`,
          `-o`,
          `params/out/${circuit}`,
          '-h',
          process.env.ENTROPY,
          '-n',
          process.env.ITERATIONS,
        ]);

        log(zokrates, resolve, reject, circuit);
      });
    }
  } catch (err) {
    throw new Error(err);
  }
}
