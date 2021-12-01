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
      privateKey?: IKeyRecord,
      publicKey?: IKeyRecord
    }
    decrypt: {
      privateKey?: IKeyRecord,
      publicKey?: IKeyRecord
    }
    signing?: IKeyRecord
    verifying?: IKeyRecord
  }
}

function state(): KeysStateInterface {
  return {
    publicKeys: [],
    privateKeys: [],
    defaults: {
      encrypt: {
        privateKey: undefined,
        publicKey: undefined
      },
      decrypt: {
        privateKey: undefined,
        publicKey: undefined
      },
      signing: undefined,
      verifying: undefined
    }
  };
}

export default state;
