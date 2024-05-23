const {
  createCreateMetadataAccountV3Instruction,
} = require('@metaplex-foundation/mpl-token-metadata');
// This uses "@metaplex-foundation/mpl-token-metadata@2" to create tokens
const { getExplorerLink } = require('@solana-developers/helpers');
const {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
} = require('@solana/web3.js');

const adresses = require('../adresses');

module.exports =
  ({ console, config }) =>
  async () => {
    const user = Keypair.fromSecretKey(
      new Uint8Array(config.blockchain.secret),
    );

    const signer1 = Keypair.fromSecretKey(new Uint8Array(adresses.signer1));
    const signer2 = Keypair.fromSecretKey(new Uint8Array(adresses.signer2));
    const signer3 = Keypair.fromSecretKey(new Uint8Array(adresses.signer3));

    console.log(`🔑 Our public key is: ${user.publicKey.toBase58()}`);

    const connection = new Connection(clusterApiUrl('devnet'));

    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    );

    console.log("adresses.multiSigMintToken ", adresses.multiSigMintToken);
    const metadataData = {
      name: 'Training Token',
      symbol: 'TRAINING',
      // Arweave / IPFS / Pinata etc link using metaplex standard for off-chain data
      uri: 'https://arweave.net/1234',
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };

    const tokenMintAccount = new PublicKey(adresses.multiSigMintToken);

    // Create PDAs for storing metadata
    const metadataPDAAndBump = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        tokenMintAccount.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    );

    const metadataPDA = metadataPDAAndBump[0];

    const transaction = new Transaction();

    // Subtitute in your token mint account from create-token-mint.ts
   
    const createMetadataAccountInstruction =
      createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataPDA,
          mint: tokenMintAccount,
          mintAuthority: new PublicKey(adresses.mintAuthorityAccount),
          payer: user.publicKey,
          updateAuthority: new PublicKey(adresses.mintAuthorityAccount),
        },
        {
          createMetadataAccountArgsV3: {
            collectionDetails: null,
            data: metadataData,
            isMutable: true,
          },
        },
      );

    transaction.add(createMetadataAccountInstruction);

    console.log("adresses.mintAuthorityAccount ",adresses.mintAuthorityAccount)
    await sendAndConfirmTransaction(connection, transaction, [
      signer1,
      signer2,
      signer3,
      user,
    ]);

    const tokenMintLink = getExplorerLink(
      'address',
      tokenMintAccount.toString(),
      'devnet',
    );

    console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);
  };
