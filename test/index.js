import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import download from 'download';
import fs from 'fs';
import config from 'config';
import { contribute } from '../src/contribution.js';
import { beacon } from '../src/beacon.js';
import { verify } from '../src/verify.js';
import { ceremony } from '../src/ceremony.js';

chai.use(chaiAsPromised);

const {
  urls: { MPC_PARAMS_URL, RADIX_FILES_URL, CIRCUIT_FILES_URL },
  circuits,
} = config;

before(async () => {
  // removing existing circuits
  if (fs.existsSync(`./circuits`)) fs.rmSync('./circuits', { recursive: true });
  fs.mkdirSync('./circuits');

  console.log('Downloading circuits...');
  const circuitsUrl = circuits.map(c => `${CIRCUIT_FILES_URL}/${c}_out`);
  await Promise.all(circuitsUrl.map(url => download(url, './circuits')));

  // removing existent radix files
  if (fs.existsSync('./radix')) fs.rmSync('./radix', { recursive: true });
  fs.mkdirSync('./radix');

  console.log('Downloading radix...');
  const radixUrl = circuits.map(c => `${RADIX_FILES_URL}/${c}`);
  await Promise.all(radixUrl.map(url => download(url, './radix')));
});

describe('Ceremony test', () => {
  before(() => {
    if (fs.existsSync('./params')) fs.rmSync('./params', { recursive: true });
    fs.mkdirSync('./params');
    if (!fs.existsSync('./params/out')) fs.mkdirSync('./params/out');
  });

  it('Should generate a new ceremony', async () => {
    await ceremony();

    for (const circuit of circuits) {
      expect(fs.existsSync(`./params/${circuit}`)).to.be.true;
    }
  });
});

describe('Contribution test', () => {
  before(async () => {
    // removing existent params
    if (fs.existsSync('./params')) fs.rmSync('./params', { recursive: true });
    fs.mkdirSync('./params');
    if (!fs.existsSync('./params/out')) fs.mkdirSync('./params/out');

    console.log('Downloading params...');
    const paramsUrl = circuits.map(c => `${MPC_PARAMS_URL}/${c}`);
    await Promise.all(paramsUrl.map(url => download(url, './params')));
  });

  it('Should contribute to the ceremony', async () => {
    process.env.ENTROPY = 'hello';
    process.env.NAME = 'nightfall';

    await contribute();

    for (const circuit of circuits) {
      expect(fs.existsSync(`./params/out/${circuit}`)).to.be.true;
    }
  });
});

describe('Beacon test', () => {
  before(async () => {
    // removing existent params
    if (fs.existsSync('./params')) fs.rmSync('./params', { recursive: true });
    fs.mkdirSync('./params');
    if (!fs.existsSync('./params/out')) fs.mkdirSync('./params/out');

    console.log('Downloading params...');
    const paramsUrl = circuits.map(c => `${MPC_PARAMS_URL}/${c}`);
    await Promise.all(paramsUrl.map(url => download(url, './params')));
  });

  it('Should apply a random beacon', async () => {
    process.env.ENTROPY = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
    process.env.ITERATIONS = 10;

    await beacon();

    for (const circuit of circuits) {
      expect(fs.existsSync(`./params/out/${circuit}`)).to.be.true;
    }
  });
});

describe('Verification test', () => {
  before(async () => {
    // removing existent params
    if (fs.existsSync('./params')) fs.rmSync('./params', { recursive: true });
    fs.mkdirSync('./params');
    if (!fs.existsSync('./params/out')) fs.mkdirSync('./params/out');

    console.log('Downloading params...');
    const paramsUrl = circuits.map(c => `${MPC_PARAMS_URL}/${c}`);
    await Promise.all(paramsUrl.map(url => download(url, './params')));
  });
  it('Should verify contributions', async () => {
    await verify();
  });
});

// after(() => {
//   fs.rmSync('./circuits', { recursive: true });
//   fs.rmSync('./params', { recursive: true });
//   fs.rmSync('./radix', { recursive: true });
// });
