const { zKey } = require('snarkjs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const chalk = require('chalk');
const Promise = require('promise');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports = async function apply({ type, name, contribData, branch, circuits }) {
  const promises = [];
  circuits.map(async circuit => {
    promises.push(
      new Promise(async (resolve, reject) => {
        s3.listObjects({ Bucket: `mpc2`, Prefix: `${branch}/${circuit}` }, (err, data) => {
          if (err) throw err;
          const bucketData = data.Contents.filter(cont => cont.Key !== `${circuit}/`).sort(
            (a, b) => new Date(b.LastModified) - new Date(a.LastModified),
          );
          s3.getObject({ Bucket: `mpc2`, Key: `${bucketData[0].Key}` }, async (err, data) => {
            let res;
            if (type === 'contribution') {
              res = await zKey.contribute(data.Body, `${type}_${circuit}.zkey`, name, contribData);
            } else if (type === 'beacon') {
              res = await zKey.beacon(
                data.Body,
                `${type}_${circuit}.zkey`,
                'beacon',
                contribData,
                10,
              );
            }
            if (!res) throw Error('Invalid inputs');

            const formData = new FormData();
            const dataPath = path.join(__dirname, `../${type}_${circuit}.zkey`);
            formData.append('contribution', fs.createReadStream(dataPath));
            formData.append('name', name);
            formData.append('circuit', circuit);

            var config = {
              method: 'post',
              url: `https://${
                branch !== 'main' ? `${branch}.ceremony` : 'ceremony'
              }.polygon-nightfall.io/upload`,
              headers: {
                ...formData.getHeaders(),
              },
              data: formData,
            };

            axios(config)
              .then(function (response) {
                console.log(chalk.green(`Applied ${type} to circuit ${circuit}`));
                console.log(chalk.blue('Verification:'));
                console.log(chalk.blue(response.data.verification));
                resolve();
              })
              .catch(function (error) {
                console.log(chalk.red(error));
                reject();
              });
          });
        });
      }),
    );
  });

  await Promise.all(promises).then(() => {
    console.log(chalk.bgGreen('Thank you for your contribution!'));
    process.exit(0);
  });
};
