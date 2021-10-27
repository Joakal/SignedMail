<template>
  <q-select v-if="options().length" :options="options()" v-model="current" /><div class="q-gutter-md row">
  <q-select
    filled
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :options="options"
    hint="Basic filtering"
    style="width: 250px; padding-bottom: 32px"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { mapGetters, useStore } from 'vuex';
import { storeKey } from 'src/store'

export default defineComponent({
  props: {
    
  },
  setup () {
    const store = useStore(storeKey)

    const current = computed({
      get: () => store.state.keys.currentKey,
      set: val => {
        store.commit('keys/updateCurrent', val)
      }
    })

    return {
      current, 
      ...mapGetters('keys', {
        options: 'optionSelect'
      })
    };
  }
})
</script>
