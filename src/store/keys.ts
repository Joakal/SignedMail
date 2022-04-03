/**
 * For storing unecrypted (public) keys and details. 
 * 
 * Do not modify to store any encrypted values here as the values are stored in unencrypted format.
 */
import { Module, VuexModule, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from 'src/store';
import { StoredKeyPair, getUserIDs, getKeyId, getPublicKeyIdByPrivateKey } from 'src/util/encryption';
import { STORAGE_KEY } from 'src/util/constants';

export interface IKeyRecord {
  armor: string;
  userID: string;
  keyID: string;
}

interface IDefaults {
  chat: {
    privateKeyID?: string
  }
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

export interface KeysStateInterface {
  publicKeys: IKeyRecord[];
  privateKeys: IKeyRecord[];
  defaults: IDefaults
}

export const restoreKeysFromLocalStorage = () => {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') as KeysStateInterface
}

const formatForTable = async (armor: string) => {

  const keyID = await getKeyId(armor);
  const userIDArray = await getUserIDs(armor);
  const userID = userIDArray.join(', ');
  
  return {
    armor,
    userID,
    keyID
  }
}

@Module({
  dynamic: true,
  namespaced: true,
  stateFactory: true,
  name: 'keys',
  store,
})
export default class Keys extends VuexModule {
  public publicKeys: IKeyRecord[] = []
  public privateKeys: IKeyRecord[] = []
  private defaults: IDefaults = {
    chat: {
      privateKeyID: undefined
    },
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
  
  @Mutation
  addPublicKey(keyRecord: IKeyRecord) {
    this.publicKeys.push(keyRecord);
  }
  
  @Mutation
  removePublicKeyByKeyID(KeyID: string) {
    this.publicKeys = this.publicKeys.filter(keyRecord => keyRecord.keyID !== KeyID);
  }
  
  @Mutation
  addPrivateKey(keyRecord: IKeyRecord) {
    this.privateKeys.push(keyRecord);
  }
  
  @Mutation
  removePrivateKeyByKeyID(KeyID: string) {
    this.privateKeys = this.privateKeys.filter(keyRecord => keyRecord.keyID !== KeyID);
  }
  
  @Mutation
  changeDefaultEncryptPrivateKeyID(keyID?: string) {
    this.defaults.encrypt.privateKeyID = keyID;
  }
  
  @Mutation
  changeDefaultEncryptPublicKeyID(keyID?: string) {
    this.defaults.encrypt.publicKeyID = keyID;
  }
  
  @Mutation
  changeDefaultDecryptPrivateKeyID(keyID?: string) {
    this.defaults.decrypt.privateKeyID = keyID;
  }
  
  @Mutation
  changeDefaultDecryptPublicKeyID(keyID?: string) {
    this.defaults.decrypt.publicKeyID = keyID;
  }
  
  @Mutation
  changeDefaultSigningKeyID(keyID?: string) {
    this.defaults.signingKeyID = keyID;
  }
  
  @Mutation
  changeDefaultVerifyingKeyID(keyID?: string) {
    this.defaults.verifyingKeyID = keyID;
  }
  
  @Mutation
  changeDefaultDisplayKeyID(keyID?: string) {
    this.defaults.displayKeyID = keyID;
  }

  @Mutation
  changeDefaultChatPrivateKeyID(keyID?: string) {
    this.defaults.chat.privateKeyID = keyID;
  }
  
  @Mutation
  initialiseKeys(keyState: KeysStateInterface) {
    const { publicKeys, privateKeys, defaults } = keyState
    this.publicKeys = publicKeys
    this.privateKeys = privateKeys
    this.defaults = defaults
  }
  
  @Action
  async addKeys (payload: { keys: StoredKeyPair }) {
    const { keys } = payload
    const publicRecord = await formatForTable(keys.publicKeyArmor);
    this.addPublicKey(publicRecord);

    if (keys.privateKeyArmor) {
      const privateRecord = await formatForTable(keys.privateKeyArmor);
      this.addPrivateKey(privateRecord);
    }
  }

  @Action
  async importPublicKey (payload: { armoredKey: string }) {
    const { armoredKey } = payload
    const publicRecord = await formatForTable(armoredKey);
    this.addPublicKey(publicRecord);
  }

  @Action
  async importPrivateKey (payload: { armoredKey: string }) {
    const { armoredKey } = payload;
    const privateRecord = await formatForTable(armoredKey);
    this.addPrivateKey(privateRecord);
  }

  get getPublicKeys () {
    return this.publicKeys;
  }

  get getOtherPublicKeysByPrivateKeyID () {
    return async (privateKeyID: string) => {
      const privateKey = this.getPrivateKeyByKeyID(privateKeyID);
      if (!privateKey) {
        return [];
      }
      const publicKeyID = await getPublicKeyIdByPrivateKey(privateKey.armor)

      return this.publicKeys.filter(publicKey => {
        return publicKey.keyID !== publicKeyID
      })
    }
  }

  get getPublicKeyByKeyID () {
    return (publicKeyID: string) => this.publicKeys.find(publicKey => {
      return publicKey.keyID === publicKeyID
    })
  }

  get getPrivateKeys () {
    return this.privateKeys;
  }

  get getPrivateKeyByKeyID () {
    return (privateKeyID: string) => this.privateKeys.find(privateKey => {
      return privateKey.keyID === privateKeyID
    })
  }

  get getDefaults () {
    return this.defaults;
  }

  get getPrivateKeyByChatDefault () {
    return () => {
      if (!this.defaults.chat.privateKeyID) {
        return;
      }

      return this.getPrivateKeyByKeyID(this.defaults.chat.privateKeyID)
    }
  }
}

store.subscribe(({type}, {keys}) => {
  // Lets not overwrite our local store when initialising
  if (type.substring(0, 4) === 'keys' && type !== 'keys/initialiseKeys') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  }
})

export const KeysModule = getModule(Keys)
