import express from 'express';
import { hasFile, routeValidator, validateContribution } from '../services/validations.js';
import { uploadContribSchema } from '../schemas/upload.js';
import { upload } from '../services/upload.js';
import { getLatestContribution } from '../services/latestContrib.js';

const router = express.Router();

router.get('/:circuit', async (req, res, next) => {
  try {
    const { circuit } = req.params;
    const contrib = await getLatestContribution({ circuit });
    return res.status(200).send(contrib.Body);
  } catch (err) {
    next(err);
  }
});

router.post('/', routeValidator.body(uploadContribSchema), hasFile, async (req, res) => {
  try {
    const { name, circuit } = req.body;
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
    await upload({ circuit, name, data: data });
  } catch (err) {
    next(err);
  }
});

export default router;
