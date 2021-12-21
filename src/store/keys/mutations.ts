import { MutationTree } from 'vuex';
import { IKeyRecord, KeysStateInterface } from './state';

const mutation: MutationTree<KeysStateInterface> = {
  addPublicKey(state, keyRecord: IKeyRecord) {
    state.publicKeys.push(keyRecord);
  },
  removePublicKey(state, removedKeyID: string) {
    state.publicKeys = state.publicKeys.filter(keyRecord => keyRecord.keyID !== removedKeyID);
  },
  addPrivateKey(state, keyRecord: IKeyRecord) {
    state.privateKeys.push(keyRecord);
  },
  removePrivateKey(state, removedKeyID: string) {
    state.privateKeys = state.privateKeys.filter(keyRecord => keyRecord.keyID !== removedKeyID);
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
  },
  changeDefaultDisplay(state, keyID: string) {
    state.defaults.displayKeyID = keyID;
  },
};

export default mutation;
