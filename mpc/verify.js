/* eslint-disable no-await-in-loop */
import childProcess from 'child_process';
import { circuits } from './utils/constants.js';
import { verifyCircuit, log, initFolders, verifyRadix } from './utils/index.js';

const { spawn } = childProcess;

async function verify(circuitName) {
  return new Promise((resolve, reject) => {
    const zokrates = spawn('/app/zokrates', [
      'mpc',
      'verify',
      '-i',
      `./params/${circuitName}`,
      '-c',
      `./compiled_circuits/${circuitName}_out`,
      '-r',
      `./radix/${circuitName}`,
    ]);

    log(zokrates, resolve, reject)

  });
}

const main = async () => {
  try {
    await initFolders();

    for (const circuit of circuits) {
        console.log(`Verifying contributions for circuit ${circuit}...`)
        await verifyRadix(circuit);
        await verifyCircuit(circuit);

        await verify(circuit)
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
