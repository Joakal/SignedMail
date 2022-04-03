<template>
  <q-form
    @submit="handleCreateKeys"
    class="q-gutter-md justify-center"
  >
    <h1>Create the keys to your private world</h1>
    <p>Write messages anywhere for one person only</p>
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
        val => emailRegex.test(val) || 'Email is not valid'
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
    <q-expansion-item
      v-if="!simple"
      v-model="expanded"
      icon="perm_identity"
      label="Advanced"
    >
      <q-select v-model="type" :options="createTypeOptions" label="Standard" />
      <q-select v-model="curve" :options="createCurveOptions" label="Standard" />
    </q-expansion-item>
    <div class="row justify-evenly q-pa-xs">
      <q-btn type="submit" color="primary" label="Create keys" />
    </div>
    <div class="row">
      <p>By creating your keys, you don't need to agree to our Terms of Service as this is a tool, not a service. For more information about SignedMail's privacy practices, see the <router-link :to="{name: 'privacy'}" replace>SignedMail Privacy Policy</router-link>. It's impossible for us to send any emails to you.</p>
    </div>
  </q-form>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { EllipticCurveName, KeyOptions } from 'openpgp';
import { defineComponent, ref, Ref } from 'vue'
import { createKeys, StoredKeyPair, emailRegex, createTypeOptions, createCurveOptions } from 'src/util/encryption';
import { KeysModule } from 'src/store/keys';
export default defineComponent({
  name: 'NewKey',
  props: {
    simple: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  emits: {
    newKeys: (payload: StoredKeyPair): boolean => !!payload,
  },
  setup(_props, { emit }) {
    const $q = useQuasar()

    const hidePassphrase = ref(true);
    const name = ref('')
    const email = ref('')
    const passphrase = ref('')
    const expanded = ref(false);
    const type: Ref<KeyOptions['type']> = ref('ecc');
    const curve: Ref<EllipticCurveName> = ref('curve25519');

    const handleCreateKeys = async () => {
      try {
        const keys = await createKeys(name.value, email.value, passphrase.value, type.value, curve.value)
        if (keys) {
          const keysArmor = {
            publicKeyArmor: keys.publicKey.armor(), 
            privateKeyArmor: keys.publicKey.armor(), 
            revocationCertificate: keys.revocationCertificate
          }
          await KeysModule.addKeys({ keys: keysArmor });

          emit('newKeys', keysArmor);
        }
      } catch (error: unknown) {
        const {message} = error as Error;
        $q.notify({
          type: 'negative',
          message,
        });
      }
    };

    return { 
      hidePassphrase, 
      name, 
      email, 
      passphrase,  
      emailRegex, 
      expanded,
      type,
      curve,
      createTypeOptions,
      createCurveOptions,
      handleCreateKeys
    };
  }
})
</script>
