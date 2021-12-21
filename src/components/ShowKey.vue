<template>
  <div>
    <q-input :model-value="keyValue" filled readonly type="textarea" :label="label">
      <template v-slot:append>
        <q-icon
          v-if="copy"
          name="content_copy"
          class="cursor-pointer"
          @click="addToClipboard({label, value: keyValue})"
        />
        <q-icon
          v-if="download"
          name="download"
          class="cursor-pointer"
          @click="exportFile(`${filename}.crt`, keyValue)"
        />
      </template>
    </q-input>
    <show-key-details v-if="keyDetail" :plainKey="keyValue" :label="label" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { exportFile } from 'quasar';
import { addToClipboard } from 'src/util/clipboard'
import ShowKeyDetails from './ShowKeyDetails.vue';
export default defineComponent({
  components: { ShowKeyDetails },
  name: 'ShowKey',
  props: {
    keyValue: {
      type: String,
      required: true,
      default: ''
    },
    label: {
      type: String,
      required: true,
      default: 'A Key'
    },
    download: {
      type: Boolean,
      default: false
    },
    copy: {
      type: Boolean,
      default: false
    },
    keyDetail: {
      type: Boolean,
      default: false
    }
  },
  setup(prop) {
    const filename = computed(() => prop.label.split(' ').join('_'));
    return {
      filename,
      exportFile,
      addToClipboard
    }
  }
})
</script>
