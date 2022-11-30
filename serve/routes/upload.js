import express from 'express';
import joi from 'joi';
import { createValidator } from 'express-joi-validation';
import AWS from 'aws-sdk';
import { zKey } from 'snarkjs';
import branchName from 'current-git-branch';

const s3 = new AWS.S3();

const validator = createValidator();

const router = express.Router();

const uploadSchema = joi.object({
  name: joi.string().alphanum().max(40).required(),
  circuit: joi
    .string()
    .valid('deposit', 'withdraw', 'transfer', 'transform', 'tokenise', 'burn')
    .required(),
});

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

async function validateContribution({ circuit, contribData }) {
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

router.post('/upload', validator.body(uploadSchema), async (req, res) => {
  try {
    const { name, circuit } = req.body;
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {
      let contrib = req.files.contribution;

      //send response immediately so the user can start working on the next circuit
      res.send({
        status: true,
        message: 'Thank you for your contribution!',
        verification: res.locals,
      });

      // THEN verify it before uploading. The verification logs are unused for now :(
      const vl = await validateContribution({ circuit, contribData: contrib.data });
      console.log(vl);
      const uploadParams = {
        Bucket: `mpc-${branchName()}`,
        Key: `${circuit}/${name}.zkey`,
        Body: contrib.data,
      };

      await s3.putObject(uploadParams, function (err, data) {
        if (err) {
          console.log('Error', err);
        }
        if (data) {
          console.log('Upload Success', data.Location);
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
