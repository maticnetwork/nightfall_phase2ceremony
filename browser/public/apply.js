const { zKey } = require('snarkjs');
const axios = require('axios').default;
const FormData = require('form-data');

async function applyContrib({ circuit, name, contribData, branch, NODE_ENV }) {
  let url;
  if (NODE_ENV === 'development') {
    url = 'http://localhost:3333/contribution';
  } else if (branch !== 'main') {
    url = `https://api-${branch}.ceremony.polygon-nightfall.io/contribution`;
  } else {
    url = 'https://api-ceremony.polygon-nightfall.io/contribution';
  }

  const o = {
    type: 'mem',
    data: null,
    fileName: `contribution_${circuit}.zkey`,
  };

  const res = await zKey.contribute(`${url}/${circuit}`, o, name, contribData);
  o.file = o.data.buffer.slice(o.data.byteOffset, o.data.byteLength + o.data.byteOffset);

  if (!res) throw Error('Invalid inputs');

  const formData = new FormData();
  formData.append('contribution', new Blob([o.file]));
  formData.append('name', name);
  formData.append('circuit', circuit);

  const call = await axios({
    method: 'POST',
    url: `${url}`,
    data: formData,
  });

  return call.data.verification;
}

window.applyContrib = applyContrib;
