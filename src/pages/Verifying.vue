<template>
  <q-page>
    <div class="flex flex-center">
      <div class="text-h4">Verifying</div>
    </div>
    <q-form @submit="handleVerifying" >
      <div class="fit col">
        <q-input v-model="input" filled type="textarea" :rules="[val => !!val || 'Field is required']" label="Message" :disable="!publicKey?.key">
          <template v-slot:append>
            <q-icon
              name="content_copy"
              class="cursor-pointer"
              @click="addToClipboard({label: 'Message', value: input})"
            />
          </template>
        </q-input>
        <q-input v-model="detachedSignature" filled type="textarea" :rules="[val => !!val || 'Field is required']" label="PGP SIGNATURE">
          <template v-slot:append>
            <q-icon
              name="content_copy"
              class="cursor-pointer"
              @click="addToClipboard({label: 'PGP SIGNATURE', value: detachedSignature})"
            />
          </template>
        </q-input>
      </div>
      <div class="fit col justify-center q-pa-sm q-gutter-md">
        <div class="row q-gutter-md">
          <q-btn color="primary" label="Verify" @click="handleVerifying" :disable="!publicKey?.key" />
        </div>
        <div class="row">
          <q-expansion-item
            class="fit"
            expand-separator
            icon="perm_identity"
            label="Settings"
            :caption="publicKey?.userID ? publicKey.userID : 'Please add a public key'"
          >
            <div class="row q-pa-sm q-gutter-md">
              <q-select
                filled
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="publicKeyOptions"
                hint="Public Key"
                option-value="key"
                option-label="userID"
                @filter="publicKeyFilterFn"
                v-model="publicKey"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </q-expansion-item>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useQuasar } from 'quasar'
import { useStore } from 'vuex';
import { storeKey } from 'src/store';
import {verifyMessage} from 'src/util/encryption';
import { addToClipboard } from 'src/util/clipboard'

export default defineComponent({
  name: 'Encrypt',
  setup() {
    const $q = useQuasar()
    const store = useStore(storeKey);
    const {publicKeys, defaults: {verifying: defaultPublicKey}} = store.state.keys;
    const isPwd = ref(false);
    const input = ref('')
    const detachedSignature = ref('')
    const publicKey = ref(defaultPublicKey);

    const handleVerifying = async () => {
      if (publicKey.value) {
        try {
          await verifyMessage(input.value, publicKey.value, detachedSignature.value)
          $q.notify({
            type: 'positive',
            message: 'This has been signed',
          });
        } catch ({message}) {
          $q.notify({
            type: 'negative',
            message: message as string,
          });
        }
      } else {
        $q.notify({
          type: 'negative',
          message: 'You must have a public key to verify with',
        });
      }
    };

    const publicKeyOptions = ref(publicKeys);
    
    const publicKeyFilterFn = (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
      if (inputValue === '') {
        doneFn(() => {
          publicKeyOptions.value = publicKeys
        })
        return
      }
      doneFn(() => {
        const needle = inputValue.toLowerCase()
        publicKeyOptions.value = publicKeys.filter(v => v.userID.toLowerCase().indexOf(needle) > -1)
      })
    };

    watch(publicKey, (currentValue) => {      
      store.commit('keys/changeDefaultVerifying', currentValue)
    });

    return { 
      isPwd, 
      input, 
      detachedSignature, 
      publicKey,
      publicKeyOptions,
      handleVerifying, 
      addToClipboard,
      publicKeyFilterFn
    }
  }
});
</script>
