const {
  Connection,
  Transaction,
  Keypair,
  clusterApiUrl,
} = require('@solana/web3.js');

module.exports =
  ({ solana, config }) =>
  async ({ serializedTx, recipientSecret }) => {
    const recipientKeypair = Keypair.fromSecretKey(
      new Uint8Array(recipientSecret),
    );
    const connection = new Connection(clusterApiUrl('devnet'));
    const txbuffer = Buffer.from(serializedTx, 'base64');

    const tx = Transaction.from(txbuffer);

    tx.partialSign(recipientKeypair);

    const encodedTx = tx
      .serialize({
        requireAllSignatures: true,
        verifySignatures: true,
      })
      .toString('base64');

    const signature = await connection.sendEncodedTransaction(encodedTx);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    await connection.confirmTransaction(
      {
        blockhash,
        lastValidBlockHeight,
        signature,
      },
      'confirmed',
    );

    return signature;
  };
