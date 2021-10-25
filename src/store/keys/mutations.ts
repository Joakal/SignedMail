import { KeyPair } from 'openpgp';
import { MutationTree } from 'vuex';
import { KeysStateInterface } from './state';

const mutation: MutationTree<KeysStateInterface> = {
  updateCurrent(state, value: KeyPair) {
    console.log('New value!', value)
    state.current = value
  },
  someMutation (/* state: KeysStateInterface */) {
    // your code
  }
};

export default mutation;
