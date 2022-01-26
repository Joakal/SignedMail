<template>
  <q-page>
    <q-table
      :title="title"
      :rows="keys"
      :columns="columns"
      :filter="filter"
      row-key="keyID"
      :pagination="pagination"
    >
      <template v-slot:header>
        <q-tr>
          <q-th
            v-for="col in columns"
            :key="col.name"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
             @click="props.expand = !props.expand"
          >
            {{ col.value }}
          </q-td>
          <q-td class="q-gutter-sm">
            <q-btn :icon="props.expand ? 'remove' : 'vpn_key'" color="primary" @click="props.expand = !props.expand">
              <q-tooltip>View {{label}}</q-tooltip>
            </q-btn>
            <q-btn icon="content_copy" color="primary" @click="addToClipboard({label, value: props.row.key})">
              <q-tooltip>Copy {{label}}</q-tooltip>
            </q-btn>
            <q-btn icon="download" color="secondary" @click="exportFile(`${fileName}.pub`, props.row.key)">
              <q-tooltip>Download {{label}}</q-tooltip>
            </q-btn>
            <q-btn icon="delete" color="negative" @click="confirmDeletion(props.row.keyID)">
              <q-tooltip>Delete {{label}}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props" v-if="props.row.key">
          <q-td colspan="2">
            <show-key :keyValue="props.row.key" :label="label" keyDetail />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, toRef } from 'vue';
import { QTable, useQuasar, exportFile } from 'quasar';
import { addToClipboard } from 'src/util/clipboard'

const columns: QTable['columns'] = [{
  name: 'keyID',
  required: true,
  label: 'Key ID',
  field: 'keyID',
  align: 'left',
  sortable: true
},{
  name: 'userID',
  required: true,
  label: 'User ID',
  field: 'userID',
  align: 'left',
  sortable: true
}];

export default defineComponent({
  name: 'KeyTable',
  components: { ShowKey: defineAsyncComponent(() => import('./ShowKey.vue')), },
  props: {
    title: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    keys: {
      type: Array,
      required: true
    }
  },
  emits: {
    deleteKey: (keyID: string): boolean => !!keyID,
  },
  setup(props, {emit}) {
    const $q = useQuasar()
    
    function confirmDeletion(keyID: string) {
      $q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this key?',
        cancel: true
      }).onOk(() => {
        emit('deleteKey', keyID);
        $q.notify({type: 'positive', message: 'Key successfully deleted'});
      })
    }

    const label = toRef(props, 'label');
    const fileName = label.value.split(' ').join('_');

    return {
      filter: ref(''),
      columns,
      fileName,
      pagination: {
        rowsPerPage: 25
      },
      confirmDeletion,
      addToClipboard,
      exportFile
    };
  }
});
</script>
