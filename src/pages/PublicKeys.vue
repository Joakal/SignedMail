<template>
  <KeyTable title="Public Keys" label="public key" :keys="rows" />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { storeKey } from 'src/store';

export default defineComponent({
  name: 'Keys',
  components: {
    KeyTable: defineAsyncComponent(() => import('components/KeyTable.vue'))
  },
  setup() {
    const store = useStore(storeKey)

    return {
      rows: computed(() => store.state.keys.publicKeys),
      removeKey: (key: string) => store.commit('keys/removePublicKey', key)
    };
  }
});
</script>
