<template>
  <div class="q-pa-md row justify-evenly fit">
    <div>
      <NewKey @newKeys="(newData) => showKeys = newData" />
    </div>
  </div>
  <div class="q-pa-md row" v-if="showKeys">
    <ShowKeys :keys="showKeys" />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, Ref, computed, onMounted} from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { Key, readKey } from 'openpgp';
import { KeysModule } from 'src/store/keys';
import { CombinedKeyPair } from 'src/util/encryption';

export default defineComponent({
  name: 'AddingKeys',
  components: {
    NewKey: defineAsyncComponent(() => import('components/NewKey.vue')),
    ShowKeys: defineAsyncComponent(() => import('components/ShowKeys.vue'))
  },
  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const showKeys: Ref<CombinedKeyPair | undefined> = ref(undefined);

    const publicKeys = computed(() => KeysModule.getPublicKeys);
    const privateKeys = computed(() => KeysModule.getPrivateKeys);
    const publicKeyExists = (key: Key) => publicKeys.value.find(publicKey => publicKey.keyID === key.getKeyID().toHex())
    const privateKeyExists = (key: Key) => privateKeys.value.find(privateKey => privateKey.keyID === key.getKeyID().toHex())

    const handleAddKey = async (key: string) => {
      try {
        const keyValue = await readKey({armoredKey: key})
        if (keyValue.isPrivate() && privateKeyExists(keyValue) || publicKeyExists(keyValue)) {
          $q.notify({
            type: 'negative',
            message: 'This key already exists locally',
          });
        } else {
          await KeysModule.importPublicKey({key: keyValue});
        }
        
        showKeys.value = { publicKey: keyValue };
      } catch (error: unknown) {
        const {message} = error as Error;
        $q.notify({
          type: 'negative',
          message,
        });
      }
    };

    onMounted(async () => {
      if (route.query?.key) {
        await handleAddKey(route.query.key as string)
      }
    })

    return { 
      showKeys,
    };
  }
})
</script>
