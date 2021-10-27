import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { KeysStateInterface } from './state';

const getters: GetterTree<KeysStateInterface, StateInterface> = {
  getPublicKeys (state) {
    return state.publicKeys;
  },
  getPrivateKeys (state) {
    return state.privateKeys;
  },
};

export default getters;
