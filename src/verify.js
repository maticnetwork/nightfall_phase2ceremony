import childProcess from 'child_process';
import circuits from '../utils/constants.js';
import log from '../utils/index.js';

const { spawn } = childProcess;

const verify = async () => {
  try {
    for (const circuit of circuits) {
      console.log(`Verifying contributions for circuit ${circuit}...`);
      await new Promise((resolve, reject) => {
        const zokrates = spawn(`${process.env.WORKDIR}zokrates`, [
          'mpc',
          'verify',
          '-i',
          `./params/${circuit}`,
          '-c',
          `./circuits/${circuit}_out`,
          '-r',
          `./radix/${circuit}`,
        ]);

        log(zokrates, resolve, reject);
      });
    }
  } catch (err) {
    throw new Error(err);
  }
};

export default verify;
