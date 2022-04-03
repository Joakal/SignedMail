<template>
  <q-page>
    <q-card>
      <q-card-section>
        <NewKey :simple="true" />
      </q-card-section>
    </q-card>
    <p>Do you have an existing private key? <router-link :to="{name: 'add'}" replace>Add it here</router-link> instead</p>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, onMounted} from 'vue'
import { useRouter } from 'vue-router';
import { KeysModule } from 'src/store/keys';

export default defineComponent({
  name: 'Splash',
  components: {
    NewKey: defineAsyncComponent(() => import('components/NewKey.vue'))
  },
  setup() {
    const router = useRouter();
    onMounted(() => {
      if (KeysModule.getDefaults.chat.privateKeyID) {
        void router.push({ name: 'chats', params: {myPrivateKeyID: KeysModule.getDefaults.chat.privateKeyID} })
      }
    })
  }
})
</script>
