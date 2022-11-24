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
  name: joi.string().alphanum().min(3).max(20).required(),
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

async function validateContribution(req, res, next) {
  try {
    const { circuit } = req.body;

    const vl = new VerifyLog();
    const r = await zKey.verifyFromR1cs(
      { type: 'file', fileName: `../circuits/${circuit}/${circuit}.r1cs` },
      { type: 'file', fileName: `../circuits/${circuit}/${circuit}.ptau` },
      req.files.contribution.data,
      vl,
    );
    res.locals = vl.verifyLog;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

router.post('/upload', validator.body(uploadSchema), validateContribution, async (req, res) => {
  try {
    const { name, circuit } = req.body;
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let contrib = req.files.contribution;
      const uploadParams = {
        Bucket: `mpc2`,
        Key: `${branchName}/${circuit}/${name}.zkey`,
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

      //send response
      res.send({
        status: true,
        message: 'Thank you for your contribution!',
        verification: res.locals,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
