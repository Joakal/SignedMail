<template>
  <div class="q-pa-md row justify-evenly fit">
    <div>
      <NewKey @newKeys="(newData) => showKeys = newData" />
    </div>
  </div>
  <div class="q-pa-md row" v-if="showKeys">
    <ShowKeys :keys="showKeys" />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, Ref, computed, onMounted} from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex';
import { Key } from 'openpgp';
import { storeKey } from 'src/store';
import { CombinedKeyPair, readImportedKey } from 'src/util/encryption';

export default defineComponent({
  name: 'AddingKeys',
  components: {
    NewKey: defineAsyncComponent(() => import('components/NewKey.vue')),
    ShowKeys: defineAsyncComponent(() => import('components/ShowKeys.vue'))
  },
  setup() {
    const $q = useQuasar()
    const store = useStore(storeKey)
    const route = useRoute()
    const showKeys: Ref<CombinedKeyPair | undefined> = ref(undefined);

    const publicKeys = computed(() => store.state.keys.publicKeys);
    const privateKeys = computed(() => store.state.keys.privateKeys);
    const publicKeyExists = (key: Key) => publicKeys.value.find(publicKey => publicKey.keyID === key.getKeyID().toHex())
    const privateKeyExists = (key: Key) => privateKeys.value.find(privateKey => privateKey.keyID === key.getKeyID().toHex())

    const handleAddKey = async (key: string) => {
      try {
        const keyValue = await readImportedKey(key)
        if (keyValue.isPrivate() && privateKeyExists(keyValue) || publicKeyExists(keyValue)) {
          $q.notify({
            type: 'negative',
            message: 'This key already exists locally',
          });
        } else {
          await store.dispatch('keys/importPublicKey', keyValue);
        }
        
        showKeys.value = { publicKey: keyValue };
      } catch (error: unknown) {
        const {message} = error as Error;
        $q.notify({
          type: 'negative',
          message,
        });
      }
    };

    onMounted(async () => {
      if (route.query?.key) {
        await handleAddKey(route.query.key as string)
      }
    })

    return { 
      showKeys,
    };
  }
})
</script>
