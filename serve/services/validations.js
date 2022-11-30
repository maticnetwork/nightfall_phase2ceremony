import { createValidator } from 'express-joi-validation';
import { zKey } from 'snarkjs';

export const routeValidator = createValidator();

class VerifyLog {
  verifyLog;
  constructor() {
    this.verifyLog = '';
  }

  info = log => {
    if (!log.startsWith('Reading') && log.startsWith('contribution'))
      this.verifyLog = log.concat('\n') + this.verifyLog;
  };
  debug = () => console.debug;
  error = () => console.error;
}

export async function beaconAuth(req, res, next) {
  const token = req.headers['x-app-token'];
  if (token && process.env.AUTH_KEY && token === process.env.AUTH_KEY) return next();
  return res.status(401).send('Unauthorized');
}

export async function hasFile(req, res, next) {
  if (!req.files) {
    return res.status(400).send({
      status: false,
      message: 'No file uploaded',
    });
  }
  next();
}

export async function validateContribution({ circuit, contribData }) {
  try {
    const vl = new VerifyLog();
    await zKey.verifyFromR1cs(
      { type: 'file', fileName: `../circuits/${circuit}/${circuit}.r1cs` },
      { type: 'file', fileName: `../circuits/${circuit}/${circuit}.ptau` },
      contribData,
      vl,
    );
    return vl;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
