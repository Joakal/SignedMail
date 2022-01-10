import { Module, VuexModule, Mutation, getModule, Action } from 'vuex-module-decorators'
import { Key } from 'openpgp'
import store from 'src/store';
import { CombinedKeyPair, getUserIDs, getPrivateKeyId, getPublicKeyId } from 'src/util/encryption';
import { STORAGE_KEY } from 'src/util/constants';

export interface IKeyRecord {
  key: string;
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

const formatForTable = async (keyType: string, key: string) => {

  let keyID = '';
  if (keyType === 'private') {
    keyID = await getPrivateKeyId(key);
  } else {
    keyID = await getPublicKeyId(key);
  }

  const userIDArray = await getUserIDs(key);
  const userID = userIDArray.join(', ');
  
  return {
    key,
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
  removePublicKey(removedKeyID: string) {
    this.publicKeys = this.publicKeys.filter(keyRecord => keyRecord.keyID !== removedKeyID);
  }
  
  @Mutation
  addPrivateKey(keyRecord: IKeyRecord) {
    this.privateKeys.push(keyRecord);
  }
  
  @Mutation
  removePrivateKey(removedKeyID: string) {
    this.privateKeys = this.privateKeys.filter(keyRecord => keyRecord.keyID !== removedKeyID);
  }
  
  @Mutation
  changeDefaultEncryptPrivateKey(keyID?: string) {
    this.defaults.encrypt.privateKeyID = keyID;
  }
  
  @Mutation
  changeDefaultEncryptPublicKey(keyID?: string) {
    this.defaults.encrypt.publicKeyID = keyID;
  }
  
  @Mutation
  changeDefaultDecryptPrivateKey(keyID?: string) {
    this.defaults.decrypt.privateKeyID = keyID;
  }
  
  @Mutation
  changeDefaultDecryptPublicKey(keyID?: string) {
    this.defaults.decrypt.publicKeyID = keyID;
  }
  
  @Mutation
  changeDefaultSigning(keyID?: string) {
    this.defaults.signingKeyID = keyID;
  }
  
  @Mutation
  changeDefaultVerifying(keyID?: string) {
    this.defaults.verifyingKeyID = keyID;
  }
  
  @Mutation
  changeDefaultDisplay(keyID?: string) {
    this.defaults.displayKeyID = keyID;
  }

  @Mutation
  changeDefaultChatPrivateKey(keyID?: string) {
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
  async addKeys (payload: { keys: CombinedKeyPair }) {
    const { keys } = payload
    const publicRecord = await formatForTable('public', keys.publicKey.armor());
    this.addPublicKey(publicRecord);

    if (keys.privateKey) {
      const privateRecord = await formatForTable('private', keys.privateKey.armor());
      this.addPrivateKey(privateRecord);
    }
  }

  @Action
  async importPublicKey (payload: { key: Key }) {
    const { key } = payload
    const publicRecord = await formatForTable('public', key.armor());
    this.addPublicKey(publicRecord);
  }

  @Action
  async importPrivateKey (payload: { key: Key }) {
    const { key } = payload
    const privateRecord = await formatForTable('public', key.armor());
    this.addPrivateKey(privateRecord);
  }
  
  @Action
  removeKeys (payload: { keys: CombinedKeyPair }) {
    const { keys } = payload
    this.removePublicKey(keys.publicKey.armor());
    if (keys.privateKey) {
      this.removePrivateKey(keys.privateKey.armor());
    }
  }

  get getPublicKeys () {
    return this.publicKeys;
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
}

store.subscribe(({type}, {keys}) => {
  // Lets not overwrite our local store when initialising
  if (type.substring(0, 4) === 'keys' && type !== 'keys/initialiseKeys') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  }
})

export const KeysModule = getModule(Keys)
