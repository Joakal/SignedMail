export interface IKeyRecord {
  key: string;
  userID: string;
  keyID: string;
}

export interface KeysStateInterface {
  currentKey?: string;
  publicKeys: IKeyRecord[];
  privateKeys: IKeyRecord[];
  defaults: {
    encrypt: {
      privateKeyID?: string
      publicKeyID?: string
    }
    decrypt: {
      privateKeyID?: string
      publicKeyID?: string
    }
    signingKeyID?: string
    verifyingKeyID?: string
  }
}

function state(): KeysStateInterface {
  return {
    publicKeys: [],
    privateKeys: [],
    defaults: {
      encrypt: {
        privateKeyID: undefined,
        publicKeyID: undefined
      },
      decrypt: {
        privateKeyID: undefined,
        publicKeyID: undefined
      },
      signingKeyID: undefined,
      verifyingKeyID: undefined
    }
  };
}

export default state;
