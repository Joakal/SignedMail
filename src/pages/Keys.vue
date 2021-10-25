<template>
  <q-page class="home-page window-height window-width row justify-center items-center">
    <div class="q-pa-md row justify-evenly" style="max-width: 80%">
      <div class="col">
        <new-key @newKeys="displayKey" />
      </div>
      <div class="col">
        <q-form
          @submit="handleAddKeys"
          class="q-gutter-md justify-center"
        >
          <h3>Add existing key</h3>
          QR CODE 
          Public Key 
          Private Key 
        </q-form>
      </div>
    </div>
    <div class="q-pa-md row" style="max-width: 80%">
      <div>
        <div>The below have been temporarily saved and cleared on browser close. Please save the below to a separate location as backup. If you lose your device, there is no way to retrieve the <strong>private key</strong> or <strong>revocation certificate</strong> without backups.</div>
        <div v-if="private_key">
          <q-input v-model="private_key" filled readonly type="textarea" label="Private Key">
            <template v-slot:append>
              <q-icon
                name="download"
                class="cursor-pointer"
                @click="exportFile('PrivateKey.crt', private_key)"
              />
            </template>
          </q-input>
        </div>
        <div v-if="revocation_certificate">
          <q-input v-model="revocation_certificate" filled readonly type="textarea" label="Revocation Certificate">
            <template v-slot:append>
              <q-icon
                name="download"
                class="cursor-pointer"
                @click="exportFile('RevocationCertificate.crt', revocation_certificate)"
              />
            </template>
          </q-input>
        </div>
        <div>
          <q-input v-model="public_key" filled readonly type="textarea" label="Public Key">
            <template v-slot:append>
              <q-icon
                name="content_copy"
                class="cursor-pointer"
                @click="addToClipboard({label: 'Public Key', value: public_key})"
              />
              <q-icon
                name="download"
                class="cursor-pointer"
                @click="exportFile('PublicKey.crt', public_key)"
              />
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { addToClipboard } from 'src/util/clipboard'
import { exportFile } from 'quasar';
import { KeyPair } from 'openpgp';

export default defineComponent({
  name: 'Keys',
  components: {
    NewKey: defineAsyncComponent(() => import('components/NewKey.vue'))
  },
  setup() {

    const private_key = ref('');
    const public_key = ref('');
    const revocation_certificate = ref('');

    const displayKey = (keys: KeyPair) => {
      console.log('We got new keys', keys)
    }

    const handleAddKeys = () => {
      console.log('Clicked handleAddKeys')
    }

    return { 
      private_key, 
      public_key, 
      revocation_certificate,
      addToClipboard,
      exportFile,
      displayKey,
      handleAddKeys,
    };
  }
});
</script>
