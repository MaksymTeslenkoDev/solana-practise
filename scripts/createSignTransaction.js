const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

const { Transaction, Keypair } = require('@solana/web3.js');

module.exports =
  ({ config, solana }) =>
  async ({
    senderSecret,
    ownerTokenAccount,
    sourceTokenAccount,
    recipientPubKey,
    recipientTokenAccount,
    amount,
    signers = null,
  }) => {
    // Tokens account
    const recipientTokenAccountPubKey = new PublicKey(recipientTokenAccount);
    const sourceTokenAccountPubKey = new PublicKey(sourceTokenAccount);
    const ownerTokenAccountPubKey = new PublicKey(ownerTokenAccount);

    // Users wallets
    const senderKeypair = Keypair.fromSecretKey(new Uint8Array(senderSecret));
    const recipientWallet = new PublicKey(recipientPubKey);


    const multisigners = signers && signers.map((secret)=>Keypair.fromSecretKey(new Uint8Array(secret)));
    const transferInstruction = Token.createTransferInstruction(
      sourceTokenAccountPubKey,
      recipientTokenAccountPubKey,
      ownerTokenAccountPubKey,
      amount * 10 ** config.token_decimals,
      multisigners,
      TOKEN_PROGRAM_ID,
    );

    // Create transaction and add transfer instruction
    const transaction = new Transaction().add(transferInstruction);

    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    transaction.feePayer = recipientWallet;

    transaction.partialSign(senderKeypair);

    // Serialize the transaction message
    const serializedTransaction = transaction.serializeMessage();
    return serializedTransaction.toString('base64');
  };
