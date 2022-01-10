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

        <GlobalPublicKey />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <NavTitle />
        <q-expansion-item
          expand-separator
          icon="mail"
          label="Change Inbox"
        >
          <q-item 
            v-for="user in uniqueUsers" 
            :key="user.keyID"
            @click="selectUser(user.keyID)"
            v-bind="user"
            clickable
            exact
          >
            <q-item-section avatar>
              <q-icon name="phone_locked" />
            </q-item-section>

            <q-item-section>
              {{user.userID}}
            </q-item-section>
          </q-item>
        </q-expansion-item>

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
    link: '/encrypt'
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

import { defineComponent, defineAsyncComponent, ref, computed } from 'vue'
import { URL_KEY } from 'src/util/constants';
import { useRouter } from 'vue-router'
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

    const essentialLinks = linksList.map(item => ({...item, link: `${router.options.history.base}${item.link}`}))
    
    const selectUser = (myPrivateKeyID: string) => {
      void router.push({ name: 'chats', params: {myPrivateKeyID} })
    }
    
    return {
      essentialLinks,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      uniqueUsers: computed(() => KeysModule.getPrivateKeys),
      selectUser
    }
  }
})
</script>
