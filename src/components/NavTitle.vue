<template>
  <q-item-label
    header
    class="text-grey-8"
  >
    <div v-if="!privateKeyExists">
      <router-link :to="{name: 'add'}" replace>Add Key</router-link> <span>to get started</span>
    </div>
    <div v-else-if="!currentKeyValue">
      <span>Select Inbox below</span>
    </div>
    <div v-else>
      {{currentUserIDs}}
    </div>
  </q-item-label>
</template>

<script lang="ts">
import { defineComponent, ref,computed, watch } from 'vue'
import { getUserIDFromKey } from 'src/util/encryption';
import { KeysModule } from 'src/store/keys';

export default defineComponent({
  name: 'NavTitle',
  setup () {
    const currentUserIDs = ref('');
    const privateKeyExists = ref(KeysModule.getPrivateKeys.length);
    const privateKeyOptions = ref(KeysModule.getPrivateKeys);
    const privateKeys = computed(() => KeysModule.getPrivateKeys);

    const currentKeyValue = computed(() => {
      const current = KeysModule.getDefaults.chat.privateKeyID
      if (!current) {
        return;
      }
      return KeysModule.getPrivateKeys.find(privateKey => privateKey.keyID === current);
    })

    const privateKeySelected = computed({
      get: () => KeysModule.getPrivateKeys.find(key => key.keyID === KeysModule.getDefaults.chat.privateKeyID),
      set: val => KeysModule.changeDefaultChatPrivateKey(val?.keyID)
    });
    
    const privateKeyFilterFn = (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
      if (inputValue === '') {
        doneFn(() => {
          privateKeyOptions.value = privateKeys.value
        })
        return;
      }
      doneFn(() => {
        const needle = inputValue.toLowerCase()
        privateKeyOptions.value = privateKeys.value.filter(v => v.userID.toLowerCase().indexOf(needle) > -1)
      })
    };

    watch(currentKeyValue, async () => {
      if (currentKeyValue.value) {
        const userIDs = await getUserIDFromKey(currentKeyValue.value.key);
        currentUserIDs.value = userIDs.join(', ');
      }
    });
    
    return {
      privateKeyExists,
      currentKeyValue,
      currentUserIDs,
      privateKeyOptions,
      privateKeyFilterFn,
      privateKeySelected,
    }
  }
})
</script>
