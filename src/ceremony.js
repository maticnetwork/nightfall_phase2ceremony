import childProcess from 'child_process';
import config from 'config';
import log from '../utils/index.js';

const { circuits } = config;

const { spawn } = childProcess;

export async function ceremony() {
  try {
    for (const circuit of circuits) {
      console.log(`Generating ceremony for ${circuit}...`);

      await new Promise((resolve, reject) => {
        const zokrates = spawn('zokrates', [
          'mpc',
          'init',
          '-i',
          `circuits/${circuit}_out`,
          '-o',
          `params/${circuit}`,
          '-r',
          `radix/${circuit}`,
        ]);

        log(zokrates, resolve, reject, circuit);
      });
    }
  } catch (err) {
    throw new Error(err);
  }
}
