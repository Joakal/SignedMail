<template>
  <div>
    <q-btn color="secondary" label="Public Key" @click="showPublicKey = true" />
    <q-dialog v-model="showPublicKey">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <q-input :model-value="publicKeyValue" filled readonly type="textarea" label="Public Key" />
          <div class="q-pa-sm q-gutter-sm">
            <q-btn color="secondary" icon="content_copy" label="Clipboard" @click="addToClipboard({label: 'Public Key', value: publicKeyValue})" />
            <q-btn color="secondary" icon="download" label="Download" @click="exportFile('PublicKey.crt', publicKeyValue)" />
            <q-btn color="secondary" icon="qr_code_2" label="QR Code" @click="qrCode" />
            <a href="https://www.mysite.com/whatever/path">Deeplink</a>
          </div>
          <canvas id="qr-code-public-key"></canvas>
          <q-select
            filled
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            clearable
            :options="publicKeyOptions"
            hint="Public Key to share"
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
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex';
import { storeKey } from 'src/store'
import { exportFile } from 'quasar'
import { addToClipboard } from 'src/util/clipboard'
import QRCode from 'qrcode'

export default defineComponent({
  props: {
    
  },
  setup () {
    const store = useStore(storeKey);
    const showPublicKey = ref(false);
    const {publicKeys, defaults: {displayKeyID}} = store.state.keys;
    console.log('displayKeyID', displayKeyID, store.state.keys)
    const publicKeyOptions = ref(publicKeys);
    const publicKey = ref(publicKeys.find(key => key.keyID === displayKeyID));
    
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

    const generateQR = async (text: string) => {
      console.log('Start QR CODE')
      let canvas = document.getElementById('qr-code-public-key');
      await QRCode.toCanvas(canvas, text, { errorCorrectionLevel: 'H' })
      console.log('Done QR CODE')
    }

    const qrCode = async () => {
      console.log('Start qrCode')
      await generateQR(`-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEYadn5BYJKwYBBAHaRw8BAQdACiQZ9hdhqqpVkU519JQYeWKmVaNzvC8P
HJDBRJGb/6zNFHRlc3QgPHRlc3RAdGVzdC5jb20+wowEEBYKAB0FAmGnZ+QE
CwkHCAMVCAoEFgACAQIZAQIbAwIeAQAhCRB0wigC6AxVYxYhBLu3xOcl8t/K
kKiCu3TCKALoDFVjhA0BAM7WcBw3HlN4iXcVs4jhwwrmhaNqKBiLAFNNjF7a
uHsiAP4lVR/tqgptHRnttpwtFisbdcIKspuFt6I5OTEGDgdqDM44BGGnZ+QS
CisGAQQBl1UBBQEBB0CgMWsvRNHHMC+Z7nKlVzx9xIM3gGFTsSooSk5fKTyb
awMBCAfCeAQYFggACQUCYadn5AIbDAAhCRB0wigC6AxVYxYhBLu3xOcl8t/K
kKiCu3TCKALoDFVjF9sBAIqc9Ybfm8DsuK36sMBRA45Fx8kGHnznABxdCzaV
o3PFAP9M2W+H5P4B5k188eGhcgk1S5mwF//NLQKU/rO3QqZODg==
=h0XG
-----END PGP PUBLIC KEY BLOCK-----`)

      console.log('Done qrCode')
    }

    const publicKeyValue = computed(() => publicKey.value?.key || '')

    watch(publicKeyValue, (currentValue) => {
        console.log('Start currentValue', currentValue)
        // await generateQR(key)
    });

    watch(publicKey, (currentValue) => {
      store.commit('keys/changeDefaultDisplay', currentValue?.keyID)
    });

    return {
      showPublicKey,
      publicKey,
      publicKeyValue,
      publicKeyOptions,
      publicKeyFilterFn,
      exportFile,
      addToClipboard,
      qrCode
    };
  }
})
</script>

        