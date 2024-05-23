const { createMultisig, createMint } = require('@solana/spl-token');
const { Connection, clusterApiUrl, Keypair } = require('@solana/web3.js');
const { getExplorerLink } = require('@solana-developers/helpers');
const logger = require('../logger');

class CreateToken {
  constructor() {}
  async createToken({
    decimals = 2,
    payer,
    freezeAuthority = null,
    multisigAmount = null,
  }) {
    try {
      logger.log('Create token started');
      const connection = this.establishConnection();
      let authorityAccount = payer.publicKey;
      if (this.shouldCreateMultisig()) {
        let signers = await this.getSigners();
        const signersAccounts = [...signers.keys()].map(key=>Keypair.fromSecretKey(new Uint8Array(key)));
        authorityAccount = await createMultisig(
          connection,
          payer,
          [...signersAccounts, payer],
          multisigAmount || signers.values().length,
        );
        logger.log(`Authorite account created: ${authorityAccount.toString()}`)
      }
      const mint = await createMint(
        connection,
        payer,
        authorityAccount,
        authorityAccount,
        decimals,
      );
      const link = this.getLink(mint);
      logger.log(`Token created: ${link}`);
      return {
        mint: mint.toString(),
        signers: this.shouldCreateMultisig() && [...signers.keys(), payer.secretKey],
        mintAuthority: authorityAccount.toString(),
      };
    } catch (e) {
      logger.error('Error while creating token', e);
    }
  }

  async getSigners() {}

  shouldCreateMultisig() {
    return false;
  }

  establishConnection() {
    return new Connection(clusterApiUrl('devnet'));
  }

  getLink(token) {
    return getExplorerLink('address', token.toString(), 'devnet');
  }
}
module.exports = { CreateToken };
