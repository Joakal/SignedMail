<template>
  <div>SignedMail - <q-select v-if="options().length" :options="options()" v-model="current" /><q-btn v-else :to="{name:'keys'}">Attach a key</q-btn>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, computed } from 'vue'
import { mapGetters, useStore } from 'vuex';
import { storeKey } from 'src/store'

export default defineComponent({
  // name: 'ComponentName'
  // SignedMail - <q-select v-model="keys" value=" {{email ? email : "No key attached"}}

  setup () {
    const store = useStore(storeKey)

    const current = computed({
      get: () => store.state.keys.current,
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
