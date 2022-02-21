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
import { useQuasar } from 'quasar'
import { Key, } from 'openpgp';
import { defineComponent, defineAsyncComponent, ref, Ref, computed, onMounted} from 'vue'
import { useRoute } from 'vue-router'
import { KeysModule } from 'src/store/keys';
import { CombinedKeyPair, myReadKey } from 'src/util/encryption';

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


    const handleAddKey = async (key: string) => {
      const publicKeys = computed(() => KeysModule.getPublicKeys);
      const privateKeys = computed(() => KeysModule.getPrivateKeys);
      const publicKeyExists = (key: Key) => publicKeys.value.find(publicKey => publicKey.keyID === key.getKeyID().toHex())
      const privateKeyExists = (key: Key) => privateKeys.value.find(privateKey => privateKey.keyID === key.getKeyID().toHex())

      const keyValue = await myReadKey({armoredKey: key})
      if (!keyValue) {
        return;
      }

      if (keyValue.isPrivate() && privateKeyExists(keyValue) || publicKeyExists(keyValue)) {
        $q.notify({
          type: 'negative',
          message: 'This key already exists locally',
        });
      } else {
        await KeysModule.importPublicKey({key: keyValue});
      }
      
      showKeys.value = { publicKey: keyValue };
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
