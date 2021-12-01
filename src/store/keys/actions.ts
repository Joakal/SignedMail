import { ActionTree } from 'vuex';
import { CombinedKeyPair, getUserIDs, getPrivateKeyId, getPublicKeyId } from 'src/util/encryption';
import { StateInterface } from '../index';
import { KeysStateInterface } from './state';

const formatForTable = async (keyType: string, key: string) => {

  let keyID = '';
  if (keyType === 'private') {
    keyID = await getPrivateKeyId(key);
  } else {
    keyID = await getPublicKeyId(key);
  }

  const userIDArray = await getUserIDs(key);
  const userIDs = userIDArray.join(', ');
  console.log('userIDs', userIDs, userIDArray)
  
  return {
    key,
    userIDs,
    keyID
  }
}

const actions: ActionTree<KeysStateInterface, StateInterface> = {
  async addKeys (store, keys: CombinedKeyPair) {
    const publicRecord = await formatForTable('public', keys.publicKey.armor());
    const privateRecord = await formatForTable('private', keys.privateKey.armor());

    store.commit('addPublicKey', publicRecord);
    store.commit('addPrivateKey', privateRecord);
  },
  removeKeys (store, keys: CombinedKeyPair) {
    store.commit('removePublicKey', keys.publicKey.armor());
    store.commit('removePrivateKey', keys.privateKey.armor());
  }
};

export default actions;
