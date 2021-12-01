import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { KeysStateInterface } from './state';

// Unable to properly use Getters with Vuex 4 and Vue 3 (composition API)
// as the typescript documentation/stackoverflow is poor on the subject
const getters: GetterTree<KeysStateInterface, StateInterface> = {
  getPublicKeys (state) {
    return state.publicKeys;
  },
  getPrivateKeys (state) {
    return state.privateKeys;
  },
};

export default getters;
