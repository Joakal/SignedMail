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
  changeDefaultEncryptPrivateKey(state, keyRecord: IKeyRecord) {
    state.defaults.encrypt.privateKey = keyRecord;
  },
  changeDefaultEncryptPublicKey(state, keyRecord: IKeyRecord) {
    state.defaults.encrypt.publicKey = keyRecord;
  },
  changeDefaultDecryptPrivateKey(state, keyRecord: IKeyRecord) {
    state.defaults.decrypt.privateKey = keyRecord;
  },
  changeDefaultDecryptPublicKey(state, keyRecord: IKeyRecord) {
    state.defaults.decrypt.publicKey = keyRecord;
  },
  changeDefaultSigning(state, keyRecord: IKeyRecord) {
    state.defaults.signing = keyRecord;
  },
  changeDefaultVerifying(state, keyRecord: IKeyRecord) {
    state.defaults.verifying = keyRecord;
  }
};

export default mutation;
