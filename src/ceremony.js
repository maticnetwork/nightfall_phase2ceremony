import childProcess from 'child_process';

import circuits from '../utils/constants.js';
import log from '../utils/index.js';

const { spawn } = childProcess;

async function ceremony(circuitName) {
  return new Promise((resolve, reject) => {
    const zokrates = spawn('zokrates', [
      'mpc',
      'init',
      '-i',
      `./circuits/${circuitName}_out`,
      '-o',
      `./params/${circuitName}`,
      '-r',
      `./radix/${circuitName}`,
    ]);

    log(zokrates, resolve, reject);
  });
}
const main = async () => {
  try {
    // await initFolders();

    for (const circuit of circuits) {
      console.log(circuit);
      // await verifyRadix(circuit);

      await ceremony(circuit);
    }
  } catch (err) {
    throw new Error(err);
  }
};

main();
