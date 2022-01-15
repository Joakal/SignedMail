<template>
  <q-form
    @submit="handleCreateKeys"
    class="q-gutter-md justify-center"
  >
    <h1>Create new keys</h1>
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
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { useQuasar } from 'quasar'
import { createKeys, CombinedKeyPair, emailRegex, createTypeOptions, createCurveOptions } from 'src/util/encryption';
import { EllipticCurveName, KeyOptions } from 'openpgp';
import { KeysModule } from 'src/store/keys';
export default defineComponent({
  name: 'NewKey',
  emits: {
    newKeys: (payload: CombinedKeyPair): boolean => !!payload,
  },
  setup(_props, { emit }) {
    const $q = useQuasar()

    const hidePassphrase = ref(true);
    const name = ref('test')
    const email = ref('test@test.com')
    const passphrase = ref('test')
    const expanded = ref(false);
    const type: Ref<KeyOptions['type']> = ref('ecc');
    const curve: Ref<EllipticCurveName> = ref('curve25519');

    const handleCreateKeys = async () => {
      try {
        const keys = await createKeys(name.value, email.value, passphrase.value, type.value, curve.value)
        if (keys) {
          await KeysModule.addKeys({keys});

          emit('newKeys', keys);
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
