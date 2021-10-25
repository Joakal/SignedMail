<template>
  <q-form
    @submit="handleCreateKeys"
    class="q-gutter-md justify-center"
  >
    <h3>Create new keys</h3>
    <q-input
      label="Full name"
      v-model="name"
      required
      :rules="[val => !!val || 'Field is required']"
    />
    <q-input
      label="Email"
      v-model="email"
      type="email"
      required
      :rules="[
        val => !!val || 'Field is required',
        val => pgpEmailRegex.test(val) || 'Email is not valid'
      ]"
    />
    <q-input
      label="Passphrase"
      v-model="passphrase"
      :type="hidePassphrase ? 'password' : 'input'"
      required
      :rules="[val => !!val || 'Field is required']"
    >
      <q-icon
        :name="hidePassphrase ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="hidePassphrase = !hidePassphrase"
      />
    </q-input>
    TODO: Advanced options
    <div class="row justify-evenly q-pa-xs">
      <q-btn type="submit" color="primary" label="Create keys" />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { LocalStorage, SessionStorage, useQuasar } from 'quasar'
import {createKeys} from 'src/util/encryption';
import { KeyPair } from 'openpgp';
export default defineComponent({
  name: 'NewKey',
  emits: {
    newKeys: (payload: KeyPair) => payload,
  },
  setup(props, { emit }) {
    const $q = useQuasar()
    // Pulled from OpenPGP's own email regex
    const pgpEmailRegex = ref(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+([a-zA-Z]{2,}|xn--[a-zA-Z\-0-9]+)))$/);

    const hidePassphrase = ref(true);
    const name = ref('test')
    const email = ref('test@test.com')
    const passphrase = ref('test')

    const handleCreateKeys = async () => {
      try {
        const keys = await createKeys(name.value, email.value, passphrase.value)
          console.log('Grab keys', keys);

        if (keys) {
          const { privateKey, publicKey, revocationCertificate } = keys;
          console.log('What revocationCertificate', revocationCertificate);
          console.log('What privateKey stringify', privateKey.armor());
          console.log('What privateKey toPublic', privateKey.toPublic());
          LocalStorage.set('signedmail-current', {
            name: name.value,
            email: email.value,
            publicKey
          });
          LocalStorage.set(`signedmail-public-${email.value}`, {
            name: name.value,
            email: email.value,
            publicKey
          });
          SessionStorage.set(`signedmail-private-${email.value}`, privateKey);

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
      pgpEmailRegex, 
      handleCreateKeys
    };
  }
})
</script>
