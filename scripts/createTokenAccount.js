const { getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');
const {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
} = require('@solana/web3.js');

module.exports =
  ({ config, console }) =>
  async ({ mint, recipient = null }) => {
    mint = new PublicKey(mint);
    const payer = Keypair.fromSecretKey(
      new Uint8Array(config.blockchain.secret),
    );
    const connection = new Connection(clusterApiUrl('devnet'));

    recipient = recipient && new PublicKey(recipient);
    if (!recipient) {
      const keygen = Keypair.generate();
      console.log('🔑 Recipient Secret:', keygen.secretKey.toString());
      console.log('🔒 Recipient Public:', keygen.publicKey.toString());
      recipient = keygen.publicKey;
    }

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      recipient,
    ).then(account => account.address.toBase58());
    console.log('🔑 Token Account:', tokenAccount);

    return tokenAccount;
  };
