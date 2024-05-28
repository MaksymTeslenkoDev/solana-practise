const { mintTo } = require('@solana/spl-token');
const {
  Keypair,
  PublicKey,
  Connection,
  clusterApiUrl,
} = require('@solana/web3.js');
const { getExplorerLink } = require('@solana-developers/helpers');

module.exports =
  ({ config, console }) =>
  async ({ mint, tokenAccount, mintAuthority, signers }) => {
    mint = new PublicKey(mint);
    tokenAccount = new PublicKey(tokenAccount);
    mintAuthority = new PublicKey(mintAuthority);

    // Our token has two decimal places
    const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, config.blockchain.token_decimals);
    const payer = Keypair.fromSecretKey(
      new Uint8Array(config.blockchain.secret),
    );
    const connection = new Connection(clusterApiUrl('devnet'));
    const signersArray = signers
      ? signers.map((signer) => Keypair.fromSecretKey(new Uint8Array(signer)))
      : undefined;
    const transactionSignature = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount,
      mintAuthority,
      10 * MINOR_UNITS_PER_MAJOR_UNITS,
      signersArray,
    );
    const link = getExplorerLink('transaction', transactionSignature, 'devnet');
    console.log(`✅ Success! Mint Token Transaction: ${link}`);
    return transactionSignature;
  };
