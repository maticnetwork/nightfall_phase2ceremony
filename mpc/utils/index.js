import download from 'download';
import 'dotenv/config';
import fs from 'fs';


export const initFolders = async () => {
    if (!fs.existsSync('./params')) fs.mkdirSync('./params');
    if (!fs.existsSync('./params/out')) fs.mkdirSync('./params/out');
    if (!fs.existsSync(`./compiled_circuits`)) fs.mkdirSync("./compiled_circuits");
    if (!fs.existsSync('./radix')) fs.mkdirSync('./radix');
}
  
export const verifyCircuit = async (circuit) => {
  if (!fs.existsSync(`./compiled_circuits/${circuit}_out`)) throw new Error("No compiled circuit found in ./compiled_circuits");
}


export const verifyRadix = async (circuit) => {
  if (!fs.existsSync(`./radix/${circuit}`)) {
      await download(`${process.env.RADIX_FILES_URL}/${circuit}`, `./radix`);
  }
}

export const prepareContribution = async (circuit) => {

  if (!fs.existsSync(`./params/${circuit}`)) {
    console.log("Downloading params...");
    await download(`${process.env.MPC_PARAMS_URL}/${circuit}`, `./params`);
  }
}

export const log = async (zokrates, resolve, reject) => {
    let output = '';

    zokrates.stdout.on('data', data => {
      output += data.toString('utf8');
    });

    zokrates.stderr.on('data', err => {
      console.log(err);
      reject(new Error(`Setup failed: ${err}`));
    });

    zokrates.on('close', () => {
      console.log(output);
      // ZoKrates sometimes outputs error through stdout instead of stderr,
      // so we need to catch those errors manually.
      if (output.includes('panicked')) {
        reject(new Error(output.slice(output.indexOf('panicked'))));
      }
      resolve(output);
    });
}
