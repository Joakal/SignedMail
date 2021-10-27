<template>
  <q-page>
    <q-input v-model="input" filled :type="isPwd ? 'password' : 'textarea'" label="Input">
      <template v-slot:append>
        <q-icon
          name="content_copy"
          class="cursor-pointer"
          @click="addToClipboard(input)"
        />
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <div class="row justify-evenly q-pa-xs">
      <q-btn color="primary" label="Encrypt" @click="handleEncrypt" />
      <q-btn color="secondary" label="Sign" @click="handleSigning" />
      <q-btn label="Reset" @click="handleSigning" />
      <q-btn color="secondary" label="Decrypt" @click="handleDecrypt" />
    </div>
    <q-input v-model="output" filled readonly type="textarea" label="Output">
      <template v-slot:append>
        <q-icon
          name="content_copy"
          class="cursor-pointer"
          @click="addToClipboard(output)"
        />
      </template>
    </q-input>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {encryptMessage } from 'src/util/encryption';
import { addToClipboard } from 'src/util/clipboard'


export default defineComponent({
  name: 'PageIndex',
  setup() {
    // TODO store password in settings
    // Other settings: popup of message (default)
    const isPwd = ref(false);
    const input = ref('String')
    const output = ref('String')

    const handleEncrypt = () => {
      // TODO Ask for passphrase
      output.value = encryptMessage(input.value)
    };

    // const handleDecrypt = () => {
    //   toEncryptInput.value = decryptMessage(toDecryptInput.value)
    // };

    // const handleSigning = () => {
    //   toDecryptInput.value = signMessage(toEncryptInput.value)
    // };

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


    return { isPwd, input, output, handleEncrypt, addToClipboard };
  }
});
</script>
