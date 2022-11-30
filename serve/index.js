// require('dotenv').config();
import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import contribution from './routes/contribution.js';
import beacon from './routes/beacon.js';
import cors from 'cors';

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  }),
);
app.use(morgan('dev'));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/contribution', contribution);
app.use('/beacon', beacon);
app.get('/healthcheck', (req, res) => {
  res.json({ status: 'Running!' }).status(200);
});

app.listen(3333);
