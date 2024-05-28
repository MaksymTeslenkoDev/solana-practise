const { Transaction } = require('@solana/web3.js');
const adresses = require('../adresses');

module.exports =
  ({ console, config, scripts }) =>
  async () => {
    // create transfer transaction from bob to alice
    const transactionSerialized = await scripts.createSignTransaction({
      senderSecret: adresses.bob_secret,
      ownerTokenAccount: adresses.bob_tokenAccount,
      sourceTokenAccount: adresses.mintAuthorityAccount,
      recipientTokenAccount: adresses.alice_tokenAccount,
      recipientPubKey: adresses.alice_wallet,
      amount: 2,
    });

    // sign transaction with alice secret
    const confirmedTx = await scripts.signTransaction({
      serializedTx: transactionSerialized,
      recipientSecret: adresses.alice_secret,
    });

    console.log('📄 Transaction confirmed:', confirmedTx);
    console.log(
      `View transaction on Solana Explorer: https://explorer.solana.com/tx/${confirmedTx}?cluster=devnet`,
    );
  };
