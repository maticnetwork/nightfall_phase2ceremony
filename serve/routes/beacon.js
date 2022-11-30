import express from 'express';
import {
  beaconAuth,
  hasFile,
  routeValidator,
  validateContribution,
} from '../services/validations.js';
import { uploadBeaconSchema } from '../schemas/upload.js';
import { upload } from '../services/upload.js';

const router = express.Router();

router.post('/', beaconAuth, routeValidator.body(uploadBeaconSchema), hasFile, async (req, res) => {
  const { circuit } = req.body;
  const { data } = req.files.contribution;

  //send response immediately so the user can start working on the next circuit
  res.send({
    status: true,
    message: 'Thank you for your contribution!',
    verification: res.locals,
  });

  // THEN verify it before uploading. The verification logs are unused for now :(
  const vl = await validateContribution({ circuit, contribData: data });
  // Upload it
  await upload({ circuit, data: data, beacon: true });
});

export default router;
