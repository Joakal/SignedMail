<template>
  <div>
    <q-btn color="secondary" label="Public Key" @click="showPublicKey = true" />
    <q-dialog v-model="showPublicKey">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <q-input :model-value="publicKeyValue" filled readonly type="textarea" label="Public Key" />
          <div class="q-pa-sm q-gutter-sm">
            <q-btn color="secondary" icon="content_copy" label="Public Key" @click="addToClipboard({label: 'Public Key', value: publicKeyValue})" :disable="!publicKeySelected" />
            <q-btn color="secondary" icon="offline_share" label="SignedMail Link" @click="addToClipboard({label: 'Public Key', value: fullUrl})" :disable="!publicKeySelected" />
            <q-btn color="secondary" icon="download" label="Download" @click="exportFile('PublicKey.crt', publicKeyValue)" :disable="!publicKeySelected" />
            <q-btn color="secondary" icon="qr_code_2" label="QR Code" @click="qrCode" :disable="!publicKeySelected" />
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
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed} from 'vue'
import { exportFile } from 'quasar'
import { addToClipboard } from 'src/util/clipboard'
import QRCode from 'qrcode'
import { MOBILE_DOMAIN_URL } from 'src/util/constants';
import { KeysModule } from 'src/store/keys';

export default defineComponent({
  props: {
    
  },
  setup () {
    const showPublicKey = ref(false);
    const publicKeyOptions = ref(KeysModule.getPublicKeys);
    
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

    const qrCode = async () => {
      let canvas = document.getElementById('qr-code-public-key');
      await QRCode.toCanvas(canvas, fullUrl.value, { errorCorrectionLevel: 'H' })
    }
      
    const publicKeys = computed(() => KeysModule.getPublicKeys);
    const publicKeyValue = computed(() => publicKeys.value.find(key => key.keyID === publicKeySelected.value?.keyID)?.key || '')
    const publicKeySelected = computed({
      get: () => KeysModule.getPublicKeys.find(key => key.keyID === KeysModule.getDefaults.displayKeyID),
      set: val => KeysModule.changeDefaultDisplay(val?.keyID)
    })
    const fullUrl = computed(() => `${MOBILE_DOMAIN_URL}add?key=${encodeURIComponent(publicKeyValue.value)}`);

    return {
      showPublicKey,
      publicKeySelected,
      publicKeyValue,
      publicKeyOptions,
      fullUrl,
      publicKeyFilterFn,
      exportFile,
      addToClipboard,
      qrCode
    };
  }
})
</script>

        