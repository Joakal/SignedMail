import { KeyPair } from 'openpgp';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { KeysStateInterface } from './state';

const getters: GetterTree<KeysStateInterface, StateInterface> = {
  optionSelect(state): {label: string, key: KeyPair}[] {
    // return [{value: 'great', label:'weird'}];
    return state.keys.map(key => {
      console.log('Key here', key)
      return {
        label: key.publicKey.users.map(user => user.userID?.userID).join(', '),
        key
      }
    });
  },
  someGetter (/* context */) {
    // your code
  }
};

export default getters;
