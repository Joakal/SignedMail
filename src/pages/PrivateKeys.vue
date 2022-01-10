<template>
  <KeyTable title="Private Keys" label="private key" :keys="rows" @deleteKey="removeKey" />
</template>

<script lang="ts">
import { KeysModule } from 'src/store/keys';
import { defineComponent, defineAsyncComponent, computed } from 'vue';

export default defineComponent({
  name: 'Keys',
  components: {
    KeyTable: defineAsyncComponent(() => import('components/KeyTable.vue'))
  },
  setup() {
    return {
      rows: computed(() => KeysModule.getPrivateKeys),
      removeKey: (keyID: string) => KeysModule.removePrivateKey(keyID)
    };
  }
});
</script>
