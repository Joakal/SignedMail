<template>
  <q-page>
    <h1 class="flex flex-center">Encrypt</h1>
    <q-form @submit="handleEncrypt" >
      <div class="fit col">
        <q-input v-model="input" filled :type="isPwd ? 'password' : 'textarea'" label="Input" :disable="!publicKeySelected?.key">
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
          <q-btn color="primary" label="Encrypt" @click="handleEncrypt" :disable="!publicKeySelected?.key" />
        </div>
        <div class="row">
          <q-expansion-item
            class="fit"
            expand-separator
            icon="perm_identity"
            label="Settings"
            :caption="publicKeySelected?.userID ? publicKeySelected.userID : 'Please add a public key'"
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
import { defineComponent, ref, computed } from 'vue';
import { useQuasar } from 'quasar'
import {encryptMessage} from 'src/util/encryption';
import { addToClipboard } from 'src/util/clipboard'
import { KeysModule } from 'src/store/keys';

export default defineComponent({
  name: 'Encrypt',
  setup() {
    const $q = useQuasar()
    const isPwd = ref(false);
    const input = ref('')
    const output = ref('')
    const publicKeyOptions = ref(KeysModule.getPublicKeys);
    const privateKeyOptions = ref(KeysModule.getPrivateKeys);

    const publicKeys = computed(() => KeysModule.getPublicKeys);
    const privateKeys = computed(() => KeysModule.getPrivateKeys);

    const publicKeySelected = computed({
      get: () => KeysModule.getPublicKeys.find(key => key.keyID === KeysModule.getDefaults.encrypt.publicKeyID),
      set: val => KeysModule.changeDefaultEncryptPublicKeyID(val?.keyID)
    })
    const privateKeySelected = computed({
      get: () => KeysModule.getPrivateKeys.find(key => key.keyID === KeysModule.getDefaults.encrypt.privateKeyID),
      set: val => KeysModule.changeDefaultEncryptPrivateKeyID(val?.keyID)
    })

    const handleEncrypt = async () => {
      if (publicKeySelected.value && privateKeySelected.value) {
        output.value = await encryptMessage(input.value, publicKeySelected.value.armor, privateKeySelected.value.armor)
      } else {
        $q.notify({
          type: 'negative',
          message: 'You must have a public key to encrypt to',
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
      handleEncrypt, 
      addToClipboard,
      publicKeyFilterFn,
      privateKeyFilterFn,
    }
  }
});
</script>
