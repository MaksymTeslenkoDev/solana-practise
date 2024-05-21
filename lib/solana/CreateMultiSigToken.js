const { CreateToken } = require('./createToken.private');
const { Keypair } = require('@solana/web3.js');

module.exports = ({ console }) =>
  class extends CreateToken {
    constructor() {
      super();
    }
    async getSigners() {
      const publicKeys = new Map();
      for (let i = 0; i < 3; i++) {
        const keypair = Keypair.generate();
        console.log(`Keypair ${i}: ${keypair.secretKey.toString()}`);
        publicKeys.set(keypair.secretKey,keypair.publicKey);
      }
      console.log('Public keys: ', [...publicKeys.values()].join(', '));
      return publicKeys;
    }

    shouldCreateMultisig() {
      return true;
    }
  };
