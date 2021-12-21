<template>
  <q-page>
    <div class="flex flex-center">
      <div class="text-h4">Decrypt</div>
    </div>
    <q-form @submit="handleDecrypt" >
      <div class="fit col">
        <q-input v-model="input" filled label="Input" type="textarea" :disable="!privateKeySelected?.key">
          <template v-slot:append>
            <q-icon
              name="content_copy"
              class="cursor-pointer"
              @click="addToClipboard({label: 'Input', value: input})"
            />
          </template>
        </q-input>
      </div>
      <div class="fit col justify-center q-pa-sm q-gutter-md">
        <div class="row q-gutter-md">
          <q-btn color="primary" label="Decrypt" @click="handleDecrypt" :disable="!privateKeySelected?.key" />
        </div>
        <div class="row">
          <q-expansion-item
            class="fit"
            expand-separator
            icon="perm_identity"
            label="Settings"
            :caption="privateKeySelected?.userID ? privateKeySelected.userID : 'Please add a private key'"
          >
            <div class="row q-pa-sm q-gutter-md">
              <q-select
                filled
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                clearable
                :options="privateKeyOptions"
                hint="Private Key to decrypt"
                option-value="keyID"
                option-label="userID"
                @filter="privateKeyFilterFn"
                v-model="privateKeySelected"
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
            <div class="row q-pa-sm q-gutter-md">
              <q-select
                filled
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                clearable
                :options="publicKeyOptions"
                hint="Public Key to verify signature"
                option-value="keyID"
                option-label="userID"
                @filter="publicKeyFilterFn"
                v-model="publicKeySelected"
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
    <div class="fit">
      <q-input v-model="output" filled readonly :type="isPwd ? 'password' : 'textarea'" label="Output" counter>
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
          <q-icon
            name="content_copy"
            class="cursor-pointer"
            @click="addToClipboard({label: 'Output', value: output})"
          />
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useQuasar } from 'quasar'
import { useStore } from 'vuex';
import { storeKey } from 'src/store';
import {decryptMessage, IDecryptionResult} from 'src/util/encryption';
import { addToClipboard } from 'src/util/clipboard'

export default defineComponent({
  name: 'Decrypt',
  setup() {
    const $q = useQuasar()
    const store = useStore(storeKey);
    const isPwd = ref(false);
    const input = ref('');
    const decryptedBody = ref<IDecryptionResult>({ decrypted: '', verified: false });
    const publicKeyOptions = ref(store.state.keys.publicKeys);
    const privateKeyOptions = ref(store.state.keys.privateKeys);
    
    const output = computed(() => decryptedBody.value.decrypted);
    const publicKeys = computed(() => store.state.keys.publicKeys);
    const privateKeys = computed(() => store.state.keys.privateKeys);

    const publicKeySelected = computed({
      get: () => store.state.keys.publicKeys.find(key => key.keyID === store.state.keys.defaults.decrypt.publicKeyID),
      set: val => store.commit('keys/changeDefaultDecryptPublicKey', val?.keyID)
    })
    const privateKeySelected = computed({
      get: () => store.state.keys.privateKeys.find(key => key.keyID === store.state.keys.defaults.decrypt.privateKeyID),
      set: val => store.commit('keys/changeDefaultDecryptPrivateKey', val?.keyID)
    })

    const handleDecrypt = async () => {
      if (privateKeySelected.value) {
        try {
          decryptedBody.value = await decryptMessage(input.value, privateKeySelected.value.key, publicKeySelected.value?.key);
        } catch ({message}) {
          $q.notify({
            type: 'negative',
            message: message as string,
          });
        }
      } else {
        $q.notify({
          type: 'negative',
          message: 'You must have a private key to decrypt from',
        });
      }
    };
    
    const publicKeyFilterFn = (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
      if (inputValue === '') {
        doneFn(() => {
          publicKeyOptions.value = publicKeys.value
        })
        return
      }
      doneFn(() => {
        const needle = inputValue.toLowerCase()
        publicKeyOptions.value = publicKeys.value.filter(v => v.userID.toLowerCase().indexOf(needle) > -1)
      })
    };
    
    const privateKeyFilterFn = (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
      if (inputValue === '') {
        doneFn(() => {
          privateKeyOptions.value = privateKeys.value
        })
        return
      }
      doneFn(() => {
        const needle = inputValue.toLowerCase()
        privateKeyOptions.value = privateKeys.value.filter(v => v.userID.toLowerCase().indexOf(needle) > -1)
      })
    };

    return { 
      isPwd, 
      input, 
      output, 
      publicKeySelected,
      publicKeyOptions,
      privateKeySelected,
      privateKeyOptions,
      handleDecrypt, 
      addToClipboard,
      publicKeyFilterFn,
      privateKeyFilterFn
    }
  }
});
</script>
