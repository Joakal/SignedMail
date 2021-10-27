<template>
  <q-form
    @submit="handleAddKeys"
    class="q-gutter-md justify-center"
  >
    <h3>Add existing key</h3>
    QR CODE 
    Public Key 
    Private Key 
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex';
import { createKeys, CombinedKeyPair } from 'src/util/encryption';
import { storeKey } from 'src/store'
export default defineComponent({
  name: 'NewKey',
  emits: {
    newKeys: (payload: CombinedKeyPair): boolean => !!payload,
  },
  setup(_props, { emit }) {
    const store = useStore(storeKey)
    const $q = useQuasar()

    const hidePassphrase = ref(true);
    const name = ref('test')
    const email = ref('test@test.com')
    const passphrase = ref('test')

    const handleAddKeys = async () => {
      try {
        const keys = await createKeys(name.value, email.value, passphrase.value)
        console.log('Grab keys', keys);
        if (keys) {
          await store.dispatch('keys/addKeys', keys);

          emit('newKeys', keys);
        }
      } catch (error: unknown) {
        const {message} = error as Error;
        $q.notify({
          type: 'negative',
          message: message,
        });
      }
    };

    return { 
      hidePassphrase, 
      name, 
      email, 
      passphrase,
      handleAddKeys
    };
  }
})
</script>
