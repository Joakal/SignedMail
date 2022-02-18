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
          <q-btn flat :to="{ name: 'home' }">SignedMail</q-btn>
        </q-toolbar-title>

        <GlobalPublicKey />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <NavTitle />
        <q-expansion-item
          expand-separator
          icon="vpn_key"
          label="Other Features"
        >
          <EssentialLink
            v-for="link in keyFeaturesList"
            :key="link.title"
            v-bind="link"
          />
        </q-expansion-item>
        <EssentialLink
          v-for="link in linksList"
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

const keyFeaturesList = [
  {
    title: 'Encrypt',
    icon: 'lock',
    named: 'encrypt'
  },
  {
    title: 'Decrypt',
    icon: 'lock_open',
    named: 'decrypt'
  },
  {
    title: 'Signing',
    icon: 'create',
    named: 'signing'
  },
  {
    title: 'Verifying',
    icon: 'how_to_reg',
    named: 'verifying'
  },
  {
    title: 'Public Keys',
    icon: 'public',
    named: 'public'
  },
  {
    title: 'Private Keys',
    icon: 'security',
    named: 'private'
  },
];


const linksList = [
  {
    title: 'Add Key',
    icon: 'vpn_key',
    named: 'add'
  },
  {
    title: 'Help',
    icon: 'rss_feed',
    named: 'help'
  },
  {
    title: 'About',
    icon: 'record_voice_over',
    named: 'about'
  },
];

import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { URL_KEY } from 'src/util/constants';
import { KeysModule, restoreKeysFromLocalStorage } from 'src/store/keys';
import { ChatsModule, restoreMessagessFromLocalStorage } from 'src/store/chats';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink: defineAsyncComponent(() => import('components/EssentialLink.vue')),
    GlobalPublicKey: defineAsyncComponent(() => import('components/GlobalPublicKey.vue')),
    NavTitle: defineAsyncComponent(() => import('components/NavTitle.vue'))
  },

  setup () {
    const router = useRouter()
    const leftDrawerOpen = ref(false)
    const oldKeysState = restoreKeysFromLocalStorage();
    const oldMessageState = restoreMessagessFromLocalStorage();

    if (oldKeysState) {
      KeysModule.initialiseKeys(oldKeysState);
    }

    if (oldMessageState) {
      ChatsModule.initialiseMessages(oldMessageState);
    }

    const urlRedirect = window.localStorage.getItem(URL_KEY);

    if (urlRedirect) {
      window.localStorage.removeItem(URL_KEY);
      void router.push({ path: JSON.parse(urlRedirect) as string }) // -> /user/123
    }

    return {
      linksList,
      keyFeaturesList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
