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
          SignedMail
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

    <div class="flex flex-center">
      <q-page-container style="max-width: 1200px" class="fit">
        <router-view />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script lang="ts">

const linksList = [
  {
    title: 'Encrypt',
    icon: 'lock',
    link: '/'
  },
  {
    title: 'Decrypt',
    icon: 'lock_open',
    link: '/decrypt'
  },
  {
    title: 'Signing',
    icon: 'create',
    link: '/signing'
  },
  {
    title: 'Verifying',
    icon: 'how_to_reg',
    link: '/verifying'
  },
  {
    title: 'Public Keys',
    icon: 'public',
    link: '/public'
  },
  {
    title: 'Private Keys',
    icon: 'security',
    link: '/private'
  },
  {
    title: 'Add Key',
    icon: 'vpn_key',
    link: '/add'
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
import { useStore } from 'vuex';
import { storeKey } from 'src/store';
import { localStorageStore } from 'src/store/plugins';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink: defineAsyncComponent(() => import('components/EssentialLink.vue'))
  },

  setup () {
    const leftDrawerOpen = ref(false)

    const store = useStore(storeKey)
    const oldState = localStorageStore();

    if (oldState) {
      store.commit('initialiseStore', oldState);
    }

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
