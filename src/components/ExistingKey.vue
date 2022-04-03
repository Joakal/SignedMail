<template>
  <q-form
    @submit="handleAddKeys"
    class="q-gutter-md justify-center"
  >
    <h1>Add PGP key</h1>
    <q-input
      label="Private Key"
      v-model="privateKey"
      required
      type="textarea"
      :rules="[val => !!val || 'Field is required']"
      :error="!!privateKeyError.length"
      :error-message="privateKeyError"
    />
    <q-file
      label="Import a private key"
      @update:model-value="handleImport"
      filled
      clearable
    />
    <div class="row justify-evenly q-pa-xs">
      <q-btn type="submit" color="primary" label="Add PGP key" />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, } from 'vue'
import { StoredKeyPair, myReadPrivateKey, resolvePrivateKey } from 'src/util/encryption';
import { KeysModule } from 'src/store/keys';
export default defineComponent({
  name: 'ExistingKey',
  emits: {
    newKeys: (payload: StoredKeyPair): boolean => !!payload,
  },
  setup(_props, { emit }) {

    const hidePassphrase = ref(true);
    const privateKey = ref('');
    const privateKeyError = ref('')

    const handleAddKeys = async () => {
      console.log('handleAddKeys')
      try {
        // Confirm that it's a valid PGP key
        await myReadPrivateKey({ armoredKey: privateKey.value });

        // Decrypt it to grab the private key
        const decryptedPrivateKey = await resolvePrivateKey(privateKey.value);

        const keys = {
          publicKeyArmor: decryptedPrivateKey.toPublic().armor(),
          privateKeyArmor: privateKey.value
        } as StoredKeyPair

        await KeysModule.addKeys({keys});
        
        console.log('handlawait KeysModule.addKeys({keys});eAddKeys', keys)
        emit('newKeys', keys);
      } catch (error: unknown) {
        const {message} = error as Error;
        privateKeyError.value = message;
      }
    };

    const handleImport = (file: Blob) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        privateKey.value = event.target?.result ? event.target.result as string : ''; 
      }
      reader.readAsText(file);
    }

    return { 
      hidePassphrase,
      privateKey,
      privateKeyError,
      handleAddKeys,
      handleImport
    };
  }
})
</script>
