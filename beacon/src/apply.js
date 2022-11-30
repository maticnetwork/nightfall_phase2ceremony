const { zKey } = require('snarkjs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const chalk = require('chalk');

module.exports = async function applyContrib({ circuit, name, contribData, branch }) {
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:3333';
  } else if (branch !== 'main') {
    url = `https://api-${branch}.ceremony.polygon-nightfall.io`;
  } else {
    url = 'https://api-ceremony.polygon-nightfall.io';
  }

  const response = await axios({
    method: 'get',
    url: `${url}/contribution/${circuit}`,
    responseType: 'arraybuffer',
  });

  const write = fs.writeFileSync(`contrib_${circuit}.zkey`, response.data, { encoding: 'binary' });

  const res = await zKey.beacon(
    `contrib_${circuit}.zkey`,
    `beacon_${circuit}.zkey`,
    'beacon',
    contribData,
    10,
    console,
  );

  if (!res) throw Error('Invalid inputs');

  const formData = new FormData();
  const dataPath = path.join(__dirname, `../beacon_${circuit}.zkey`);
  formData.append('contribution', fs.createReadStream(dataPath));
  formData.append('circuit', circuit);

  const call = await axios({
    method: 'POST',
    url: `${url}/beacon`,
    data: formData,
    headers: { 'x-app-token': process.env.AUTH_TOKEN },
  });
  console.log(chalk.green(`Applied beacon to circuit ${circuit}`));
  return call.data.verification;
};
