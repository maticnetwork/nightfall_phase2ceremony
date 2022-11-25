const { zKey } = require('snarkjs');
const axios = require('axios').default;
const FormData = require('form-data');
const Promise = require('promise');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function applyContrib({ circuits, type, name, contribData, branch }) {
  const promises = [];
  circuits.map(async circuit => {
    promises.push(
      new Promise(async (resolve, reject) => {
        s3.makeUnauthenticatedRequest(
          'listObjects',
          { Bucket: `mpc2`, Prefix: `${branch}/${circuit}` },
          (err, data) => {
            if (err) throw err;
            const bucketData = data.Contents.filter(cont => cont.Key !== `${circuit}/`).sort(
              (a, b) => new Date(b.LastModified) - new Date(a.LastModified),
            );
            s3.makeUnauthenticatedRequest(
              'getObject',
              { Bucket: `mpc2`, Key: `${bucketData[0].Key}` },

              async (err, data) => {
                let res;
                const o = {
                  type: 'mem',
                  data: null,
                  fileName: `${type}_${circuit}.zkey`,
                };
                if (type === 'contribution') {
                  res = await zKey.contribute(data.Body, o, name, contribData, console);
                  o.file = o.data.buffer.slice(
                    o.data.byteOffset,
                    o.data.byteLength + o.data.byteOffset,
                  );
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
                formData.append('contribution', new Blob([o.file]));
                formData.append('name', name);
                formData.append('circuit', circuit);

                var config = {
                  method: 'post',
                  url: `http://${
                    branch !== 'main' ? `${branch}.ceremony` : 'ceremony'
                  }.polygon-nightfall.io:3333/upload`,
                  data: formData,
                };

                axios(config)
                  .then(function (response) {
                    console.log(`Applied ${type} to circuit ${circuit}`);
                    console.log('Verification:');
                    console.log(response.data.verification);
                    resolve();
                  })
                  .catch(function (error) {
                    console.log(error);
                    reject();
                  });
              },
            );
          },
        );
      }),
    );
  });

  await Promise.all(promises).then(() => {
    console.log('Thank you for your contribution!');
  });
}

window.applyContrib = applyContrib;
