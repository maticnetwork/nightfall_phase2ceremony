import childProcess from 'child_process';
import config from 'config';
import log from '../utils/index.js';

const { circuits } = config;

const { spawn } = childProcess;

export async function verify() {
  try {
    for (const circuit of circuits) {
      console.log(`Verifying contributions for circuit ${circuit}...`);
      await new Promise((resolve, reject) => {
        const zokrates = spawn('zokrates', [
          'mpc',
          'verify',
          '-i',
          `params/${circuit}`,
          '-c',
          `circuits/${circuit}_out`,
          '-r',
          `radix/${circuit}`,
        ]);

        log(zokrates, resolve, reject);
      });
    }
  } catch (err) {
    throw new Error(err);
  }
}
