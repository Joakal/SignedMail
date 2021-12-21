<template>
  <div class="q-gutter-md">
    <div>The below is on your device but may be cleared on browser close. Please save the below to a separate device as backup. If you lose your device, there is no way to retrieve the <strong>private key</strong> or <strong>revocation certificate</strong> without backups.</div>
    <div v-if="keys.privateKey">
      <show-key :keyValue="keys.privateKey.armor()" label="Private Key" download copy keyDetail />
    </div>
    <div v-if="keys.revocationCertificate">
      <show-key :keyValue="keys.revocationCertificate" label="Revocation Certificate" download copy />
    </div>
    <div>
      <show-key :keyValue="keys.publicKey.armor()" label="Public Key" download copy keyDetail />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,  PropType } from 'vue'
import { CombinedKeyPair } from 'src/util/encryption';
import { exportFile } from 'quasar';
import { addToClipboard } from 'src/util/clipboard'
import ShowKey from './ShowKey.vue';
export default defineComponent({
  components: { ShowKey },
  name: 'ShowKeys',
  props: {
    keys: {
      type: Object as PropType<CombinedKeyPair>,
      required: true
    },
  },
  setup() {
    return {
      exportFile,
      addToClipboard
    }
  }
})
</script>
