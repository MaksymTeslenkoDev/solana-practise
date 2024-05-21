const { Connection, PublicKey, Signer } = require('@solana/web3.js');

declare namespace CreateToken {
  interface CreateTokenProps {
    decimals: number;
    payer: Signer;
    multisigAmount: number;
    freezeAuthority?: PublicKey;
  }

  interface CreateMintProps extends CreateTokenProps {
    connection: Connection;
    authorityAccount: PublicKey;
  }

  export abstract class CreateToken {
    createToken(props: CreateTokenProps): Promise<string>;

    abstract getSigners(publicKey: string | string[]): Promise<Record<[Uint8Array,string]>>;
    establishConnection(): Connection;
    getLink(token: PublicKey): string;
  }

  export class CreateSingleSigToken extends CreateToken {
    createAuthority(): Promise<PublicKey>;
  }

  export class CreateMultiSigToken extends CreateToken {
    createAuthority(): Promise<PublicKey>;
  }
}
