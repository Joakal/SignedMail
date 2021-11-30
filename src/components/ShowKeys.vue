<template>
  <div class="q-gutter-md">
    <div>The below have been temporarily saved and may be cleared on browser close. Please save the below to a separate device as backup. If you lose your device, there is no way to retrieve the <strong>private key</strong> or <strong>revocation certificate</strong> without backups.</div>
    <div v-if="keys.privateKey">
      <q-input :model-value="keys.privateKey.armor()" filled readonly type="textarea" label="Private Key">
        <template v-slot:append>
          <q-icon
            name="download"
            class="cursor-pointer"
            @click="exportFile('PrivateKey.crt', keys.privateKey.armor())"
          />
        </template>
      </q-input>
    </div>
    <div v-if="keys.revocationCertificate">
      <q-input :model-value="keys.revocationCertificate" filled readonly type="textarea" label="Revocation Certificate">
        <template v-slot:append>
          <q-icon
            name="download"
            class="cursor-pointer"
            @click="exportFile('RevocationCertificate.crt', keys.revocationCertificate)"
          />
        </template>
      </q-input>
    </div>
    <div>
      <q-input :model-value="keys.publicKey.armor()" filled readonly type="textarea" label="Public Key">
        <template v-slot:append>
          <q-icon
            name="content_copy"
            class="cursor-pointer"
            @click="addToClipboard({label: 'Public Key', value: keys.publicKey.armor()})"
          />
          <q-icon
            name="download"
            class="cursor-pointer"
            @click="exportFile('PublicKey.crt', keys.publicKey.armor())"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,  PropType } from 'vue'
import { CombinedKeyPair } from 'src/util/encryption';
import { exportFile } from 'quasar';
import { addToClipboard } from 'src/util/clipboard'
export default defineComponent({
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
