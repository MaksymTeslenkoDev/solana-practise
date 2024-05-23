const { Keypair } = require('@solana/web3.js');

module.exports = ({ solana, config }) => async () => {
    const payer = Keypair.fromSecretKey(new Uint8Array(config.blockchain.secret));
    const SingleSig = new solana.CreateToken()
    return await SingleSig.createToken({
        payer,
        multisigAmount: 2,
        decimals:config.token_decimals
    });
};