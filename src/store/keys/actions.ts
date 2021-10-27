import { ActionTree } from 'vuex';
import { readKey } from 'openpgp';
import { CombinedKeyPair } from 'src/util/encryption';
import { StateInterface } from '../index';
import { KeysStateInterface } from './state';

const formatForTable = async (key: string) => {
  const keys = await readKey({ armoredKey: key })
  return {
    key,
    userID: keys.users.map(user => user.userID?.userID).join(', '),
  }
}

const actions: ActionTree<KeysStateInterface, StateInterface> = {
  async addKeys (store, keys: CombinedKeyPair) {
    const publicRecord = await formatForTable(keys.publicKey.armor());
    const privateRecord = await formatForTable(keys.privateKey.armor());

    store.commit('addPublicKey', publicRecord);
    store.commit('addPrivateKey', privateRecord);
  },
  removeKeys (store, keys: CombinedKeyPair) {
    store.commit('removePublicKey', keys.publicKey.armor());
    store.commit('removePrivateKey', keys.privateKey.armor());
  }
};

export default actions;
