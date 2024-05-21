const adresses = require('../adresses');

module.exports =
  ({ scripts }) =>
  async () => {
    let mint = adresses.multiSigMintToken;
    let signers = [adresses.signer1, adresses.signer2, adresses.signer3];
    let mintAuthority = adresses.mintAuthorityAccount;
    if(!mint || !signers || !mintAuthority) {
        const multisigData = await app.scripts.createMultiSigToken();
        mint = multisigData.mint;
        signers = multisigData.signers;
        mintAuthority = multisigData.mintAuthority;
    }

    const recipient = adresses.bob_wallet;
    let tokenAccount = adresses.bob_tokenAccount;
    if(!tokenAccount) {
        tokenAccount = await scripts.createTokenAccount({
            mint,
            recipient,
        });
    }

    await scripts.mintToken({
      mint,
      tokenAccount,
      mintAuthority,
      signers,
    });
  };
