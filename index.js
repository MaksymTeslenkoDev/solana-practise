'use strict';

const path = require('node:path');
const { loadApplication } = require('./src/loader');
const adresses = require('./adresses');

const APPLICATION_PATH = path.join(process.cwd(), '../solana-practise');

(async () => {
  const app = await loadApplication(APPLICATION_PATH);
  try {
    const { mint , signers, mintAuthority } = await app.scripts.createMultiSigToken();
    const recipient = adresses.recipient;
    
    const tokenAccount = await app.scripts.createTokenAccount({
      mint,
      recipient,
    });

    await app.scripts.mintToken({
      mint,
      tokenAccount,
      mintAuthority,
      signers,
    });
  } catch (e) {
    console.error('Error ', e);
  }
})();
