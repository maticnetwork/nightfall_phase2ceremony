const { zKey } = require('snarkjs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const chalk = require('chalk');
const Promise = require('promise');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports = async function applyContrib({ circuit, contribData, branch, NODE_ENV }) {
  return new Promise((resolve, reject) => {
    try {
      s3.makeUnauthenticatedRequest(
        'listObjects',
        { Bucket: `mpc-${branch}`, Prefix: `${circuit}` },
        (err, data) => {
          if (err) throw err;
          const bucketData = data.Contents.filter(cont => cont.Key !== `${circuit}/`).sort(
            (a, b) => new Date(b.LastModified) - new Date(a.LastModified),
          );
          s3.makeUnauthenticatedRequest(
            'getObject',
            { Bucket: `mpc-${branch}`, Key: `${bucketData[0].Key}` },

            async (err, data) => {
              let res = await zKey.beacon(
                data.Body,
                `beacon_${circuit}.zkey`,
                'beacon',
                contribData,
                10,
              );
              if (!res) throw Error('Invalid inputs');

              const formData = new FormData();
              const dataPath = path.join(__dirname, `../beacon_${circuit}.zkey`);
              formData.append('contribution', fs.createReadStream(dataPath));
              formData.append('name', 'beacon');
              formData.append('circuit', circuit);

              let url;
              if (NODE_ENV === 'development') {
                url = 'http://localhost:3333/upload';
              } else if (branch === 'main') {
                url = 'https://api-ceremony.polygon-nightfall.io/upload';
              } else {
                url = `https://api-${branch}.ceremony.polygon-nightfall.io/upload`;
              }

              var config = {
                method: 'post',
                url,
                data: formData,
              };

              const call = await axios(config);
              console.log(chalk.green(`Applied beacon to circuit ${circuit}`));

              resolve(call.data.verification);
              return call.data.verification;
            },
          );
        },
      );
    } catch (error) {
      console.log(chalk.red(error));
      reject(error);
    }
  });
};
