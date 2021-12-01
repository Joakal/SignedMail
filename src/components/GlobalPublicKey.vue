<template>
  <div>
    <q-btn color="secondary" label="Public Key" @click="showPublicKey = true" />
    <q-dialog v-model="showPublicKey">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <q-input :model-value="publicKeyValue" filled readonly type="textarea" label="Public Key">
            <template v-slot:append>
              <q-icon
                name="content_copy"
                class="cursor-pointer"
                @click="addToClipboard({label: 'Public Key', value: publicKeyValue})"
              />
              <q-icon
                name="download"
                class="cursor-pointer"
                @click="exportFile('PublicKey.crt', publicKeyValue)"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-select
          filled
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          clearable
          :options="publicKeyOptions"
          hint="Public Key to verify signature"
          option-value="key"
          option-label="userID"
          @filter="publicKeyFilterFn"
          v-model="publicKey"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex';
import { storeKey } from 'src/store'
import { exportFile } from 'quasar';
import { addToClipboard } from 'src/util/clipboard'

export default defineComponent({
  props: {
    
  },
  setup () {
    const store = useStore(storeKey);
    const showPublicKey = ref(false);
    const {publicKeys, defaults: {displayKeyID}} = store.state.keys;
    console.log('displayKeyID', displayKeyID, store.state.keys)
    const publicKeyOptions = ref(publicKeys);
    const publicKey = ref(publicKeys.find(key => key.keyID === displayKeyID));
    
    const publicKeyFilterFn = (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
      if (inputValue === '') {
        doneFn(() => {
          publicKeyOptions.value = publicKeys
        })
        return
      }
      doneFn(() => {
        const needle = inputValue.toLowerCase()
        publicKeyOptions.value = publicKeys.filter(v => v.userID.toLowerCase().indexOf(needle) > -1)
      })
    };

    const publicKeyValue = computed(() => publicKey.value?.key || '')

    watch(publicKey, (currentValue) => {
      store.commit('keys/changeDefaultDisplay', currentValue?.keyID)
    });

    return {
      showPublicKey,
      publicKey,
      publicKeyValue,
      publicKeyOptions,
      publicKeyFilterFn,
      exportFile,
      addToClipboard,
    };
  }
})
</script>

        