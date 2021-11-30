<template>
  <q-page>
    <q-table
      :title="title"
      :rows="keys"
      :columns="columns"
      :filter="filter"
      row-key="key"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
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
            <q-btn icon="delete" color="negative" @click="confirmDeletion(props.row.key)">
              <q-tooltip>Delete {{label}}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td>
            <pre>{{props.row.key}}</pre>
          </q-td>
          <q-td auto-width />
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, toRef } from 'vue';
import { QTable, useQuasar, exportFile } from 'quasar';
import { addToClipboard } from 'src/util/clipboard'

const columns: QTable['columns'] = [{
  name: 'userID',
  required: true,
  label: 'User ID',
  field: 'userID',
  align: 'left',
  sortable: true
}];

export default defineComponent({
  name: 'KeyTable',
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
    deleteKey: (payload: string): boolean => !!payload,
  },
  setup(props, {emit}) {
    const $q = useQuasar()
    
    function confirmDeletion(key: string) {
      $q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this key?',
        cancel: true
      }).onOk(() => {
        emit('deleteKey', key);
        $q.notify({type: 'positive', message: 'Key successfully deleted'});
      })
    }

    const label = toRef(props, 'label');
    const fileName = label.value.split(' ').join('_');

    return {
      filter: ref(''),
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      columns,
      fileName,
      confirmDeletion,
      addToClipboard,
      exportFile
    };
  }
});
</script>
