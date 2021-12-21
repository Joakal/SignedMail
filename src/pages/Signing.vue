<template>
  <q-page>
    <div class="flex flex-center">
      <div class="text-h4">Signing</div>
    </div>
    <q-form @submit="handleSigning" >
      <div class="fit col">
        <q-input v-model="input" filled type="textarea" label="Input" :disable="!privateKey?.key">
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
          <q-btn color="primary" label="Sign" @click="handleSigning" :disable="!privateKey?.key" />
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
                :options="privateKeyOptions"
                hint="Private Key"
                option-value="keyID"
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
import { defineComponent, ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar'
import { useStore } from 'vuex';
import { storeKey } from 'src/store';
import {signMessage} from 'src/util/encryption';
import { addToClipboard } from 'src/util/clipboard'

export default defineComponent({
  name: 'Encrypt',
  setup() {
    const $q = useQuasar()
    const store = useStore(storeKey);
    const {privateKeys, defaults: {signingKeyID}} = store.state.keys;
    const isPwd = ref(false);
    const input = ref('')
    const output = ref('')
    const privateKeyID = ref(signingKeyID);

    const handleSigning = async () => {
      if (privateKey.value?.key) {
        const signature = await signMessage(input.value, privateKey.value.key)
        const combined = `${input.value}\n\n${signature}`

        output.value = combined;
      } else {
        $q.notify({
          type: 'negative',
          message: 'You must have a private key to sign with',
        });
      }
    };

    const privateKeyOptions = ref(privateKeys);
    
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

    const privateKey = computed(() => privateKeys.find(key => key.keyID === privateKeyID.value))

    watch(privateKeyID, (currentValue) => {      
      store.commit('keys/changeDefaultSigning', currentValue)
    });

    return { 
      isPwd, 
      input, 
      output, 
      privateKeyID,
      privateKeyOptions,
      handleSigning, 
      addToClipboard,
      privateKeyFilterFn
    }
  }
});
</script>
