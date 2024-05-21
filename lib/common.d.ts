import { Keypair } from "@solana/web3.js";

declare namespace common{
    function createTokenMint(props:{authorityKeypair:Keypair,decimals:number, }):Promise<string>;
}
