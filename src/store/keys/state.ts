export interface IKeyRecord {
  key: string;
  userID: string;
  keyID: string;
}

export interface KeysStateInterface {
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
    displayKeyID?: string
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
      verifyingKeyID: undefined,
      displayKeyID: undefined
    }
  };
}

export default state;
