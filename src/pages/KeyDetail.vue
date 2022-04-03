<template>
  <div class="q-pa-md row">
    <div v-if="showKeys">
      <ShowKeys :keys="showKeys" />
    </div>
    <div v-else>
      The key ID for {{keyID}} does not exist on this device
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, Ref, onMounted, watch} from 'vue'
import { useRoute } from 'vue-router'
import { KeysModule } from 'src/store/keys';
import { StoredKeyPair, myReadKey, myReadPrivateKey } from 'src/util/encryption';

export default defineComponent({
  name: 'KeyDetail',
  components: {
    ShowKeys: defineAsyncComponent(() => import('components/ShowKeys.vue'))
  },
  setup() {
    const route = useRoute()
    const keyID = ref('');
    const showKeys: Ref<StoredKeyPair | undefined> = ref(undefined);

    const processKeyID = async () => {
      keyID.value = route.params.keyID as string
      
      // Public Key ID only?
      const publicKeyRecord = KeysModule.getPublicKeyByKeyID(keyID.value);

      if (publicKeyRecord) {
        const publicKey = await myReadKey({armoredKey: publicKeyRecord.armor})
        const encryptionKey = await publicKey.getEncryptionKey();
        const privateKeyRecord = KeysModule.getPrivateKeyByKeyID(encryptionKey.getKeyID().toHex());

        showKeys.value = {
          privateKeyArmor: privateKeyRecord?.armor,
          publicKeyArmor: publicKeyRecord.armor
        }
        return;
      }
      
      // Private Key ID
      const privateKeyRecord = KeysModule.getPrivateKeyByKeyID(keyID.value);

      if (privateKeyRecord) {
        const privateKey = await myReadPrivateKey({armoredKey: privateKeyRecord.armor})
        const publicKey = privateKey.toPublic();

        showKeys.value = {
          privateKeyArmor: privateKeyRecord.armor,
          publicKeyArmor: publicKey.armor()
        }
        return;
      }
    }

    onMounted(async () => {
      if (route.params.keyID) {
        await processKeyID();
      }
    })
    
    watch(() => route.params.keyID, async () => {
      await processKeyID();
    });

    return { 
      showKeys,
      keyID,
    };
  }
})
</script>
