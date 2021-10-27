<template>
  <div class="q-pa-md row justify-evenly fit">
    <div>
      <NewKey @newKeys="displayKey" />
    </div>
    <div>
      <AddKey @newKeys="displayKey" />
    </div>
  </div>
  <div class="q-pa-md row" v-if="showKeys">
    <ShowKeys :keys="showKeys" />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, Ref } from 'vue'
import { CombinedKeyPair } from 'src/util/encryption';

export default defineComponent({
  name: 'AddingKeys',
  components: {
    NewKey: defineAsyncComponent(() => import('components/NewKey.vue')),
    AddKey: defineAsyncComponent(() => import('components/AddKey.vue')),
    ShowKeys: defineAsyncComponent(() => import('components/ShowKeys.vue'))
  },
  setup() {
    const showKeys: Ref<CombinedKeyPair | undefined> = ref(undefined);

    const displayKey = (keys: CombinedKeyPair) => {
      showKeys.value = keys;

      console.log('We got new keys', keys)
    }

    return { 
      showKeys,
      displayKey,
    };
  }
})
</script>
