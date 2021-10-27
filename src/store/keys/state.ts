export interface IKeyRecord {
  key: string;
  userID: string;
}
// userIDs: MaybeArray<UserID>;
// passphrase?: string;
// type?: 'ecc' | 'rsa';
// curve?: EllipticCurveName;
// rsaBits?: number;
// keyExpirationTime?: number;
// date?: Date;
// subkeys?: SubkeyOptions[];
// format?: 'armored' | 'object' | 'binary';
// config?: PartialConfig;

export interface KeysStateInterface {
  currentKey: string | undefined;
  publicKeys: IKeyRecord[]
  privateKeys: IKeyRecord[]
}

function state(): KeysStateInterface {
  return {
    currentKey: undefined,
    publicKeys: [],
    privateKeys: [],
  };
}

export default state;
