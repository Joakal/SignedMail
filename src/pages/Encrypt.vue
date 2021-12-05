<template>
  <q-page>
    <div class="flex flex-center">
      <div class="text-h4">Encrypt</div>
    </div>
    <q-form @submit="handleEncrypt" >
      <div class="fit col">
        <q-input v-model="input" filled :type="isPwd ? 'password' : 'textarea'" label="Input" :disable="!publicKey?.key">
          <template v-slot:append>
            <q-icon
              name="content_copy"
              class="cursor-pointer"
              @click="addToClipboard({label: 'Input', value: input})"
            />
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <div class="fit col justify-center q-pa-sm q-gutter-md">
        <div class="row q-gutter-md">
          <q-btn color="primary" label="Encrypt" @click="handleEncrypt" :disable="!publicKey?.key" />
          <q-btn @click="attemptShrink" />
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
            <div class="row q-pa-sm q-gutter-md">
              <q-select
                filled
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                clearable
                :options="privateKeyOptions"
                hint="Private Key signing (optional)"
                option-value="key"
                option-label="userID"
                @filter="privateKeyFilterFn"
                v-model="privateKey"
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
      <q-input v-model="output" filled readonly type="textarea" label="Output" counter>
        <template v-slot:append>
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
import { defineComponent, ref, watch } from 'vue';
import { useQuasar } from 'quasar'
import { useStore } from 'vuex';
import { storeKey } from 'src/store';
import {encryptMessage} from 'src/util/encryption';
import { addToClipboard } from 'src/util/clipboard'
import { compress, decompress } from 'lz-string';

export default defineComponent({
  name: 'Encrypt',
  setup() {
    const $q = useQuasar()
    const store = useStore(storeKey);
    const {publicKeys, privateKeys, defaults: {encrypt: {privateKeyID, publicKeyID}}} = store.state.keys;
    const isPwd = ref(false);
    const input = ref('')
    const output = ref('')
    const publicKey = ref(publicKeys.find(key => key.keyID === publicKeyID));
    const privateKey = ref(privateKeys.find(key => key.keyID === privateKeyID));

    const handleEncrypt = async () => {
      if (publicKey.value) {
        output.value = await encryptMessage(input.value, publicKey.value, privateKey.value)
      } else {
        $q.notify({
          type: 'negative',
          message: 'You must have a public key to encrypt to',
        });
      }
    };

    const attemptShrink = () => {
      const string = 'This is my compression test.';
      console.log('Size of sample is: ', string.length);
      const compressed = compress(string);
      console.log('Size of compressed sample is: ', compressed.length);
      const output = decompress(compressed);
      console.log('Sample is: ', output);
    }

    const publicKeyOptions = ref(publicKeys);
    const privateKeyOptions = ref(privateKeys);
    
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

    watch(publicKey, (currentValue) => {      
      store.commit('keys/changeDefaultEncryptPublicKey', currentValue?.keyID)
    });

    watch(privateKey, (currentValue) => {      
      store.commit('keys/changeDefaultEncryptPrivateKey', currentValue?.keyID)
    });

    return { 
      isPwd, 
      input, 
      output, 
      publicKey,
      publicKeyOptions,
      privateKey,
      privateKeyOptions,
      handleEncrypt, 
      addToClipboard,
      publicKeyFilterFn,
      privateKeyFilterFn,
      attemptShrink
    }
  }
});
</script>
