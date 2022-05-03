import childProcess from 'child_process';

import circuits from '../utils/constants.js';
import log from '../utils/index.js';

const { spawn } = childProcess;

const beacon = async () => {
  try {
    if (!process.env.ENTROPY) throw new Error('Please provide source of randomness');
    if (!process.env.ITERATIONS) throw new Error('Please provide number of iterations');

    for (const circuit of circuits) {
      console.log(`Generating beacon for ${circuit}...`);
      await new Promise((resolve, reject) => {
        const zokrates = spawn(`${process.env.WORKDIR}zokrates`, [
          'mpc',
          'beacon',
          '-i',
          `./params/${circuit}`,
          `-o`,
          `./params/out/${circuit}`,
          '-h',
          process.env.ENTROPY,
          '-n',
          process.env.ITERATIONS,
        ]);

        log(zokrates, resolve, reject);
      });
    }
  } catch (err) {
    throw new Error(err);
  }
};

export default beacon;
