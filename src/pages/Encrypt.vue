<template>
  <q-page>
    <current-key-select />
    <q-input v-model="input" filled :type="isPwd ? 'password' : 'textarea'" label="Input">
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
    <div class="row justify-center q-pa-sm q-gutter-md">
      <q-btn color="primary" label="Encrypt" @click="handleEncrypt" />
      <q-select
        filled
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        hint="Basic filtering"
        option-value="key"
        option-label="userID"
        style="width: 250px; padding-bottom: 32px"
        @filter="filterFn"
        :modelValue="publicKey"
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
    <q-input v-model="output" filled readonly type="textarea" label="Output">
      <template v-slot:append>
        <q-icon
          name="content_copy"
          class="cursor-pointer"
          @click="addToClipboard({label: 'Output', value: output})"
        />
      </template>
    </q-input>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { storeKey } from 'src/store';
import {encryptMessage, signMessage, testEncrypt} from 'src/util/encryption';
import { addToClipboard } from 'src/util/clipboard'

export default defineComponent({
  name: 'PageIndex',
  components: {
    CurrentKeySelect: defineAsyncComponent(() => import('components/CurrentKeySelect.vue'))
  },
  setup() {
    // TODO store password in settings
    // Other settings: popup of message (default)
    const isPwd = ref(false);
    const input = ref('String')
    const output = ref('String')
    const publicKey = ref(null);
    const store = useStore(storeKey)

    const handleEncrypt = () => {
      // TODO Ask for passphrase
      output.value = encryptMessage(input.value)
    };

    // const handleDecrypt = () => {
    //   toEncryptInput.value = decryptMessage(toDecryptInput.value)
    // };

    const handleSigning = async () => {
      await testEncrypt();
      output.value = signMessage(input.value)
    };

    // const copyClipy = () => copyToClipboard('some text')
    //   .then(() => {
    //     alert('Copied!');
    //     // success!
    //   })
    //   .catch(() => {
    //     alert('NOPE!');
    //     // fail
    //   })
//     (window as any).Fingerprint.isAvailable((result: string) => {
//   resolve(result);
// }, (errorObject: {code: string, message: string}) => {
//   reject(new Error(errorObject.message));
// }, {
//   allowBackup: true
// });
    // function isAvailableSuccess(result: string): void {
    //   /*
    //   result depends on device and os. 
    //   iPhone X will return 'face' other Android or iOS devices will return 'finger' Android P+ will return 'biometric'
    //   */
    //   something.value = 'isAvailableSuccess'
    // }

    // function isAvailableError(error: IError): void {
    //   // 'error' will be an object with an error code and message
    //   something.value = `isAvailableError ${error.message}`
    // }
    // function successCallback(){
    //   something.value = 'Authentication successful'
    // }

    // function errorCallback(error){
    //   something.value = 'Authentication invalid ' + error.message;
    // }

    // const something = ref('something');
    // function checking(): void {
    //   // 'error' will be an object with an error code and message
    //   something.value = 'checking'
    //   // Fingerprint.isAvailable(isAvailableSuccess, isAvailableError, {allowBackup: true});
    //   Fingerprint.show({
    //   clientId: 'Fingerprint-Demo',
    //   clientSecret: 'password', //Only necessary for Android
    //   description: 'Some biometric description', disableBackup: false, allowBackup: true
    // }, successCallback, errorCallback)
    //   // Fingerprint.loadBiometricSecret({
    //   //     description: 'Some biometric description',
    //   //     disableBackup: true, // always disabled on Android
    //   //   }, successCallback, errorCallback);

    // }
    const publicKeys = store.state.keys.publicKeys;
    const options = ref(publicKeys);

    return { 
      isPwd, 
      input, 
      output, 
      publicKey,
      options,
      handleEncrypt, 
      addToClipboard,
      filterFn: (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
        if (inputValue === '') {
          doneFn(() => {
            options.value = publicKeys
          })
          return
        }
        doneFn(() => {
          const needle = inputValue.toLowerCase()
          options.value = publicKeys.filter(v => v.userID.toLowerCase().indexOf(needle) > -1)
        })
      },
    }
  }
});
</script>
