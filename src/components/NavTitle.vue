<template>
  <div>
    <q-item-label
      header
    >
      <div v-if="!privateKeyExists">
        <router-link :to="{name: 'add'}" replace>Add Key</router-link> <span>to get started</span>
      </div>
      <div v-else-if="!currentKeyValue">
        <span>Select Inbox below</span>
      </div>
      <div>
        <q-item 
          clickable
          tag="a"
          @click="selectUser(currentKeyValue.keyID)"
        >
          <q-item-section avatar>
            <q-icon name="phone_locked" />
          </q-item-section>

          <q-item-section>
            {{currentKeyValue?.userID}}
          </q-item-section>
        </q-item>
      </div>
    </q-item-label>
    <q-expansion-item
      expand-separator
      icon="mail"
      label="Change Inbox"
      v-if="uniqueUsers.length"
    >
      <q-item 
        v-for="user in uniqueUsers"
        :key="user.keyID"
        @click="selectUser(user.keyID)"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref,computed, } from 'vue'
import { useRouter } from 'vue-router'
import { KeysModule } from 'src/store/keys';

export default defineComponent({
  name: 'NavTitle',
  setup () {
    const router = useRouter()
    const currentUserIDs = ref('');
    const privateKeyExists = ref(KeysModule.getPrivateKeys.length);
    const currentKeyValue = computed(() => KeysModule.getPrivateKeyByChatDefault())
    
    const selectUser = (myPrivateKeyID: string) => {
      KeysModule.changeDefaultChatPrivateKey(myPrivateKeyID)
      void router.push({ name: 'chats', params: {myPrivateKeyID} })
    }
    
    return {
      privateKeyExists,
      currentKeyValue,
      currentUserIDs,
      uniqueUsers: computed(() => KeysModule.getPrivateKeys.filter(privateKey => privateKey.keyID !== currentKeyValue?.value?.keyID)),
      selectUser
    }
  }
})
</script>
