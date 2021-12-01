import { MutationTree } from 'vuex';
import { IKeyRecord, KeysStateInterface } from './state';

const mutation: MutationTree<KeysStateInterface> = {
  updateCurrent(state, key: string) {
    state.currentKey = key
  },
  addPublicKey(state, keyRecord: IKeyRecord) {
    state.publicKeys.push(keyRecord);
  },
  removePublicKey(state, removedKey: string) {
    state.publicKeys = state.publicKeys.filter(keyRecord => keyRecord.key !== removedKey);
  },
  addPrivateKey(state, keyRecord: IKeyRecord) {
    state.privateKeys.push(keyRecord);
  },
  removePrivateKey(state, removedKey: string) {
    state.privateKeys = state.privateKeys.filter(keyRecord => keyRecord.key !== removedKey);
  },
  changeDefaultEncryptPrivateKey(state, keyID: string) {
    state.defaults.encrypt.privateKeyID = keyID;
  },
  changeDefaultEncryptPublicKey(state, keyID: string) {
    state.defaults.encrypt.publicKeyID = keyID;
  },
  changeDefaultDecryptPrivateKey(state, keyID: string) {
    state.defaults.decrypt.privateKeyID = keyID;
  },
  changeDefaultDecryptPublicKey(state, keyID: string) {
    state.defaults.decrypt.publicKeyID = keyID;
  },
  changeDefaultSigning(state, keyID: string) {
    state.defaults.signingKeyID = keyID;
  },
  changeDefaultVerifying(state, keyID: string) {
    state.defaults.verifyingKeyID = keyID;
  }
};

export default mutation;
