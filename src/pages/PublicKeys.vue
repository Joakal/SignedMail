<template>
  <KeyTable title="Public Keys" label="public key" :keys="rows" @deleteKey="removeKey" />
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
      rows: computed(() => KeysModule.getPublicKeys),
      removeKey: (keyID: string) => KeysModule.removePublicKey(keyID)
    };
  }
});
</script>
