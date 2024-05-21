const { createMultisig, createMint } = require('@solana/spl-token');
const { Connection, clusterApiUrl } = require('@solana/web3.js');
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
      let signers = await this.getSigners();
      let authorityAccount = signers.values()[0];
      if (this.shouldCreateMultisig()) {
        authorityAccount = await createMultisig(
          connection,
          payer,
          [...signers.values(), payer.publicKey],
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
        signers: [...signers.keys(), payer.secretKey],
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
