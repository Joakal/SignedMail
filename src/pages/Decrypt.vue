<template>
  <q-page>
    <div class="flex flex-center">
      <div class="text-h4">Decrypt</div>
    </div>
    <q-form @submit="handleDecrypt" >
      <div class="fit col">
        <q-input v-model="input" filled label="Input" type="textarea" :disable="!privateKey?.key">
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
          <q-btn color="primary" label="Decrypt" @click="handleDecrypt" :disable="!privateKey?.key" />
        </div>
        <div class="row">
          <q-expansion-item
            class="fit"
            expand-separator
            icon="perm_identity"
            label="Settings"
            :caption="privateKey?.userID ? privateKey.userID : 'Please add a private key'"
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
                v-model="privateKeyID"
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
                v-model="publicKeyID"
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
import { defineComponent, ref, computed, watch } from 'vue';
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
    const {publicKeys, privateKeys, defaults: {decrypt}} = store.state.keys;
    const isPwd = ref(false);
    const input = ref('');
    const decryptedBody = ref<IDecryptionResult>({ decrypted: '', verified: false });
    const publicKeyOptions = ref(publicKeys);
    const privateKeyOptions = ref(privateKeys);
    const publicKeyID = ref(decrypt.publicKeyID);
    const privateKeyID = ref(decrypt.privateKeyID);
    const output = computed(() => decryptedBody.value.decrypted);

    const handleDecrypt = async () => {
      if (privateKey.value) {
        try {
          decryptedBody.value = await decryptMessage(input.value, privateKey.value.key, publicKey.value?.key)
          console.log('Handling decrypt', decryptedBody)
        } catch ({message}) {
          $q.notify({
            type: 'negative',
            message: message as string,
          });
        }

        console.log('HMM', decryptedBody.value);
      } else {
        $q.notify({
          type: 'negative',
          message: 'You must have a private key to decrypt from',
        });
      }
    };
    
    const publicKeyFilterFn = (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
      console.log('INPUTVALUE', inputValue)
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
    
    const privateKeyFilterFn = (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
      if (inputValue === '') {
        doneFn(() => {
          privateKeyOptions.value = privateKeys
        })
        return
      }
      doneFn(() => {
        const needle = inputValue.toLowerCase()
        privateKeyOptions.value = privateKeys.filter(v => v.userID.toLowerCase().indexOf(needle) > -1)
      })
    };

    const publicKey = computed(() => publicKeys.find(key => key.keyID === publicKeyID.value))
    const privateKey = computed(() => privateKeys.find(key => key.keyID === privateKeyID.value))

    watch(publicKeyID, (currentValue) => {
      store.commit('keys/changeDefaultDecryptPublicKey', currentValue)
    });

    watch(privateKeyID, (currentValue) => {
      store.commit('keys/changeDefaultDecryptPrivateKey', currentValue)
    });

    return { 
      isPwd, 
      input, 
      output, 
      publicKey,
      publicKeyOptions,
      privateKey,
      privateKeyOptions,
      handleDecrypt, 
      addToClipboard,
      publicKeyFilterFn,
      privateKeyFilterFn
    }
  }
});
</script>
