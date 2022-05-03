import childProcess from 'child_process';
import circuits from '../utils/constants.js';
import log from '../utils/index.js';

const { spawn } = childProcess;

const contribute = async () => {
  try {
    if (!process.env.ENTROPY) throw new Error('Please provide source of randomness');
    if (!process.env.NAME) throw new Error('What is... your name? What is... your quest?');

    for (const circuit of circuits) {
      console.log(`Generating contribution for ${circuit}...`);
      await new Promise((resolve, reject) => {
        const zokrates = spawn(`${process.env.WORKDIR}zokrates`, [
          'mpc',
          'contribute',
          '-i',
          `./params/${circuit}`,
          '-o',
          `./params/out/${circuit}`,
          '-e',
          process.env.ENTROPY,
        ]);

        log(zokrates, resolve, reject);
      });
    }
  } catch (err) {
    throw new Error(err);
  }
};

export default contribute;
