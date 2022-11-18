import childProcess from 'child_process';
import config from 'config';
import log from '../utils/index.js';

const { circuits } = config;

const { spawn } = childProcess;

export async function contribute() {
  try {
    if (!process.env.ENTROPY) throw new Error('Please provide source of randomness');
    if (!process.env.NAME) throw new Error('What is... your name? What is... your quest?');

    for (const circuit of circuits) {
      console.log(`Generating contribution for ${circuit}...`);

      await new Promise((resolve, reject) => {
        const zokrates = spawn('zokrates', [
          'mpc',
          'contribute',
          '-i',
          `params/${circuit}`,
          '-o',
          `params/out/${circuit}`,
          '-e',
          process.env.ENTROPY,
        ]);

        log(zokrates, resolve, reject, circuit);
      });
    }
  } catch (err) {
    throw new Error(err);
  }
}
