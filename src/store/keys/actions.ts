import { ActionTree } from 'vuex';
import { CombinedKeyPair, getUserIDs, getPrivateKeyId, getPublicKeyId } from 'src/util/encryption';
import { StateInterface } from '../index';
import { KeysStateInterface } from './state';
import { Key } from 'openpgp';

const formatForTable = async (keyType: string, key: string) => {

  let keyID = '';
  if (keyType === 'private') {
    keyID = await getPrivateKeyId(key);
  } else {
    keyID = await getPublicKeyId(key);
  }

  const userIDArray = await getUserIDs(key);
  const userID = userIDArray.join(', ');
  
  return {
    key,
    userID,
    keyID
  }
}

const actions: ActionTree<KeysStateInterface, StateInterface> = {
  async addKeys (store, keys: CombinedKeyPair) {
    const publicRecord = await formatForTable('public', keys.publicKey.armor());
    store.commit('addPublicKey', publicRecord);

    if (keys.privateKey) {
      const privateRecord = await formatForTable('private', keys.privateKey.armor());
      store.commit('addPrivateKey', privateRecord);
    }
  },
  async importPublicKey (store, key: Key) {
    const publicRecord = await formatForTable('public', key.armor());
    console.log('adding to the list', publicRecord)
    store.commit('addPublicKey', publicRecord);
  },
  async importPrivateKey (store, key: Key) {
    const privateRecord = await formatForTable('public', key.armor());
    console.log('adding to the list', privateRecord)
    store.commit('addPrivateKey', privateRecord);
  },
  removeKeys (store, keys: CombinedKeyPair) {
    store.commit('removePublicKey', keys.publicKey.armor());
    if (keys.privateKey) {
      store.commit('removePrivateKey', keys.privateKey.armor());
    }
  },
};

export default actions;
