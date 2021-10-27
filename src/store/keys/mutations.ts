import { MutationTree } from 'vuex';
import { KeysStateInterface } from './state';

const mutation: MutationTree<KeysStateInterface> = {
  updateCurrent(state, key: string) {
    state.currentKey = key
  },
  addPublicKey(state, keyRecord) {
    state.publicKeys.push(keyRecord);
  },
  removePublicKey(state, removedKey: string) {
    state.publicKeys = state.publicKeys.filter(keyRecord => keyRecord.key !== removedKey);
  },
  addPrivateKey(state, keyRecord) {
    state.privateKeys.push(keyRecord);
  },
  removePrivateKey(state, removedKey: string) {
    state.privateKeys = state.privateKeys.filter(keyRecord => keyRecord.key !== removedKey);
  },
};

export default mutation;
