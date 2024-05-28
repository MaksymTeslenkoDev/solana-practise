const { createTransferInstruction } = require('@solana/spl-token');

const {
  Transaction,
  Keypair,
  Connection,
  PublicKey,
  clusterApiUrl,
} = require('@solana/web3.js');

module.exports =
  ({ config, solana }) =>
  async ({
    senderSecret,
    ownerTokenAccount,
    sourceTokenAccount,
    recipientPubKey,
    recipientTokenAccount,
    amount,
  }) => {
    // Tokens account
    const recipientTokenAccountPubKey = new PublicKey(recipientTokenAccount);
    const sourceTokenAccountPubKey = new PublicKey(sourceTokenAccount);
    const ownerTokenAccountPubKey = new PublicKey(ownerTokenAccount);

    // Users wallets
    const senderKeypair = Keypair.fromSecretKey(new Uint8Array(senderSecret));
    const recipientWallet = new PublicKey(recipientPubKey);
    const transferInstruction = createTransferInstruction(
      ownerTokenAccountPubKey,
      recipientTokenAccountPubKey,
      senderKeypair.publicKey,
      amount * 10 ** config.blockchain.token_decimals,
    );

    const connection = new Connection(clusterApiUrl('devnet'));

    // Create transaction and add transfer instruction
    const transaction = new Transaction().add(transferInstruction);

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    transaction.feePayer = recipientWallet;
    transaction.partialSign(senderKeypair);

    // Serialize the transaction message
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });
    return serializedTransaction.toString('base64');
  };
