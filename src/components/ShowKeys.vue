<template>
  <div class="q-gutter-md">
    <div>The below is on your device but may be cleared on browser close. Please save the below to a separate device as backup. If you lose your device, there is no way to retrieve the <strong>private key</strong> or <strong>revocation certificate</strong> without backups.</div>
    <div v-if="keys.privateKeyArmor">
      <show-key :keyValue="keys.privateKeyArmor" label="Private Key" download copy keyDetail />
    </div>
    <div v-if="keys.revocationCertificate">
      <show-key :keyValue="keys.revocationCertificate" label="Revocation Certificate" download copy />
    </div>
    <div>
      <show-key :keyValue="keys.publicKeyArmor" label="Public Key" download copy keyDetail />
    </div>
  </div>
</template>

<script lang="ts">
import { exportFile } from 'quasar';
import { defineComponent, defineAsyncComponent, PropType } from 'vue'
import { StoredKeyPair } from 'src/util/encryption';
import { addToClipboard } from 'src/util/clipboard'

export default defineComponent({
  components: { ShowKey: defineAsyncComponent(() => import('./ShowKey.vue')), },
  name: 'ShowKeys',
  props: {
    keys: {
      type: Object as PropType<StoredKeyPair>,
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
