export interface IKeyRecord {
  key: string;
  userID: string;
}

export interface KeysStateInterface {
  currentKey?: string;
  publicKeys: IKeyRecord[];
  privateKeys: IKeyRecord[];
  defaults: {
    encrypt: {
      privateKey?: IKeyRecord,
      publicKey?: IKeyRecord
    },
    decrypt: {
      privateKey?: IKeyRecord,
      publicKey?: IKeyRecord
    }
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
      }
    }
  };
}

export default state;
