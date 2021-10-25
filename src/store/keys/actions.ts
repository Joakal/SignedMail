import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { KeysStateInterface } from './state';

const actions: ActionTree<KeysStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default actions;
