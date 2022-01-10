<template>
  <q-expansion-item
    v-if="keyRead"
    class="fit"
    expand-separator
    icon="perm_identity"
    label="Advanced"
    caption="Key details"
  >
    <q-list bordered separator>
      <q-item>
        <q-item-section>
            <q-item-label>
              {{encryptionKeyID}}
            </q-item-label>
            <q-item-label caption>Private Key ID</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-item-label>
              {{signingKeyID}}
            </q-item-label>
            <q-item-label caption>Public Key ID</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-item-label>
              {{keyRead.getUserIDs()}}
            </q-item-label>
            <q-item-label caption>User IDs</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-item-label>
              {{keyRead.getCreationTime()}}
            </q-item-label>
            <q-item-label caption>Creation Time</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-item-label>
              {{keyRead.getKeyIDs().map(keyID => keyID.toHex())}}
            </q-item-label>
            <q-item-label caption>All Key IDs</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-item-label>
              {{keyRead.getFingerprint()}}
            </q-item-label>
            <q-item-label caption>Fingerprint</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
            <q-item-label>
              {{keyRead.getAlgorithmInfo()}}
            </q-item-label>
            <q-item-label caption>Algorithim</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent,  PropType, ref, Ref, onMounted, watch } from 'vue'
import { Key, readKey } from 'openpgp';
export default defineComponent({
  name: 'ShowKeys',
  props: {
    keyValue: {
      type: Object as PropType<Key>,
      default: undefined
    },
    plainKey: {
      type: String,
      default: undefined
    }
  },
  setup(props) {
    const keyRead = ref(undefined) as Ref<Key | undefined>;
    const encryptionKeyID = ref('');
    const signingKeyID = ref('');
    
    onMounted(async () => {
      const { keyValue, plainKey } = props;
      if (keyValue) {
        keyRead.value = keyValue
      } else if (plainKey) {
        keyRead.value = await readKey({armoredKey: plainKey});
      }
    })

    watch(keyRead, async () => {
      if (keyRead.value) {
        const keyValue = await keyRead.value.getEncryptionKey();
        encryptionKeyID.value = keyValue.getKeyID().toHex();
      }
    });

    watch(keyRead, async () => {
      if (keyRead.value) {
        const keyValue = await keyRead.value.getSigningKey();
        signingKeyID.value = keyValue.getKeyID().toHex();
      }
    });

    return {
      encryptionKeyID,
      signingKeyID,
      keyRead
    }
  }
})
</script>
