'use strict';

const path = require('node:path');
const { loadApplication } = require('./src/loader');

const APPLICATION_PATH = path.join(process.cwd(), '../solana-practise');

(async () => {
  const app = await loadApplication(APPLICATION_PATH);
  try {
    await app.api.createMultisigAndTransfer();
  } catch (e) {
    console.error('Error ', e);
  }
})();
