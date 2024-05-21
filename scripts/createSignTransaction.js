const {
    Token,
    TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');

const {Transaction} = require('@solana/web3.js');

module.exports = ({config, solana}) = async ({sender, sourceTokenAccount, destinationTokenAccount, amount, signers=[]})=>{
    const transferInstruction = Token.createTransferInstruction(
        sourceTokenAccount,
        destinationTokenAccount,
        sender,
        amount*10**config.token_decimals,
        signers,
        TOKEN_PROGRAM_ID
    );

    // Create transaction and add transfer instruction
    const transaction = new Transaction().add(transferInstruction);
}