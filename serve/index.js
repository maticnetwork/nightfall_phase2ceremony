import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import upload from './routes/upload.js';

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  }),
);

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static('static'));
app.use('/', upload);

app.get('/healthcheck', (req, res) => {
  res.json({ status: 'Running!' }).status(200);
});

app.listen(3333);
