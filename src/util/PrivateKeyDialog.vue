<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <p class="text-title">{{title}}</p>
        <p>Unlocking private key is required for decrypting and signing messages</p>
        <q-form
          @submit="onOKClick"
          class="q-gutter-md"
        >
          <q-input
            label="Passphrase"
            v-model="passphrase"
            :type="hidePassphrase ? 'password' : 'input'"
            :error="!!passphraseError.length"
            :error-message="passphraseError"
            required
            :rules="[val => !!val || 'Field is required']"
            autofocus
          >
            <q-icon
              :name="hidePassphrase ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="hidePassphrase = !hidePassphrase"
            />
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
        <q-btn color="primary" type="submit" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
    
<script lang="ts">
import { defineComponent, ref, toRef, Ref, onMounted } from 'vue';
import { useDialogPluginComponent } from 'quasar'
import { decryptKey, PrivateKey, readPrivateKey } from 'openpgp';

export default defineComponent({
  name: 'PrivateKeyDialog',
  props: {
    privateKeyString: {
      type: String,
      required: true
    }
  },

  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const privateKeyString = toRef(props, 'privateKeyString');
    const passphrase = ref('');
    const hidePassphrase = ref(true);
    const passphraseError = ref('');
    const resolvedPrivateKey = ref(undefined) as Ref<PrivateKey | undefined>;
    const title = ref('');

    onMounted(async () => {
      resolvedPrivateKey.value = await readPrivateKey({ armoredKey: privateKeyString.value });
      const username = resolvedPrivateKey.value.getUserIDs().join(', ');
      title.value = `Passphrase for ${username}`
    })

    const onOKClick = async () => {
      if (resolvedPrivateKey.value) {
        try {
          const decryptedPrivateKey = await decryptKey({
            privateKey: resolvedPrivateKey.value,
            passphrase: passphrase.value
          });
          return onDialogOK(decryptedPrivateKey);
        } catch (error: unknown) {
          const {message} = error as Error;
          passphraseError.value = message
        }
      } else {
        passphraseError.value = 'Error, no resolved private key found'
      }
    }

    return {
      dialogRef,
      onDialogHide,
      title,
      passphrase,
      hidePassphrase,
      passphraseError,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
})
</script>