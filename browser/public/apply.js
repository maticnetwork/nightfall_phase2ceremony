const { zKey } = require('snarkjs');
const axios = require('axios').default;
const FormData = require('form-data');
const Promise = require('promise');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function applyContrib({ circuit, type, name, contribData, branch, NODE_ENV }) {
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
              let res;
              const o = {
                type: 'mem',
                data: null,
                fileName: `${type}_${circuit}.zkey`,
              };
              if (type === 'contribution') {
                res = await zKey.contribute(data.Body, o, name, contribData);
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

              let url;
              console.log(NODE_ENV);
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

              // console.log(`Applied ${type} to circuit ${circuit}`);
              // console.log('Verification:');
              // console.log(call.data.verification);
              resolve(call.data.verification);
              return call.data.verification;
            },
          );
        },
      );
    } catch (error) {
      reject(error);
    }
  });
}

window.applyContrib = applyContrib;
