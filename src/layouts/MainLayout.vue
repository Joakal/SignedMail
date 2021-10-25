<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <current-key-select />
        </q-toolbar-title>

        <q-btn color="secondary" label="Public Key" @click="showPublicKey" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

const linksList = [
  {
    title: 'Encrypt or Sign',
    icon: 'lock',
    link: '/'
  },
  {
    title: 'Decrypt',
    icon: 'lock_open',
    link: '/decrypt'
  },
  {
    title: 'Keys',
    icon: 'vpn_key',
    link: '/keys'
  },
  {
    title: 'Help',
    icon: 'rss_feed',
    link: '/help'
  },
  {
    title: 'About',
    icon: 'record_voice_over',
    link: '/about'
  },
];

import { defineComponent, defineAsyncComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink: defineAsyncComponent(() => import('components/EssentialLink.vue')),
    CurrentKeySelect: defineAsyncComponent(() => import('components/CurrentKeySelect.vue'))
  },

  setup () {
    const leftDrawerOpen = ref(false)

    const showPublicKey = () => {
      console.log('YEAH');
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      showPublicKey,
    }
  }
})
</script>
