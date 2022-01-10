<template>
  <q-page>
    <q-banner class="bg-primary text-white">
      <q-btn round icon="arrow_circle_left" @click="goBack" /> {{publicKey?.userID}}
    </q-banner>
    <span v-if="!publicKey">
      No public key could be found. Have you added their public key?
    </span>
    <span v-else-if="hasEncryptedMessages">
      There are messages that are currently encrypted.
      <q-btn color="primary" @click="retryDecryption">Try decrypting again</q-btn>
    </span>
    <div v-else style="width: 100%; max-width: 400px">
      <q-chat-message
        v-for="(chat, index) in chats" 
        :key="index"
        v-bind="chat"
        :name="chat.detail.chatUserID"
        :text="[chat.chat]"
        :stamp="chat.detail.createdDate?.toLocaleString()"
        :sent="chat.detail.verification === 'self'"
        :text-color="chat.detail.verification === 'self' ? 'white' : 'black'"
        :bg-color="chat.detail.verification === 'self' ? 'primary' : 'grey-4'"
        clickable
        exact
      >
        <template v-slot:stamp v-if="chat.detail.verification !== 'self'">
          {{chat.detail.createdDate?.toLocaleString()}}
          <q-icon v-if="chat.detail.verification === 'verified'" name="check_circle_outline" color="positive"></q-icon>
          <q-icon v-else name="error_outline" color="negative">
            <q-tooltip v-if="chat.detail.verification === 'not_found'">
              There was no matching public key found for {{theirPublicKeyID}}
            </q-tooltip>
            <q-tooltip>
              The signature verification failed for {{theirPublicKeyID}}
            </q-tooltip>
          </q-icon>
        </template>
      </q-chat-message>
      <q-input bottom-slots v-model="text" type="textarea">
        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="submitMessage" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { readMessage } from 'openpgp';
import { myCreateMessage, processMessage } from 'src/util/chatting'
import { ChatsModule } from 'src/store/chats';
import { addToClipboard } from 'src/util/clipboard'
import { processMessagesToChats } from 'src/util/chatting';
import { KeysModule } from 'src/store/keys';

const isValidMessage = async (message: string) => {
  try {
    await readMessage({ armoredMessage: message });
    return true;
  } catch {
    return false;
  }
}

export default defineComponent({
  name: 'Chats',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const myPrivateKeyID = ref('');
    const theirPublicKeyID = ref('');
    const text = ref('');

    const chats = computed(() => ChatsModule.getChatsByPrivateKeyIDAndPublicKeyID(myPrivateKeyID.value, theirPublicKeyID.value));
    const messages = computed(() => ChatsModule.getMessagesByPrivateKeyID(myPrivateKeyID.value));
    const publicKey = computed(() => KeysModule.getPublicKeyByKeyID(theirPublicKeyID.value));

    const processInboxChange = async () => {
      if (messages.value.length > chats.value.length) {
        try {
          await processMessagesToChats(myPrivateKeyID.value);
        } catch (exception: unknown) {
          const error = exception as Error;
          $q.notify({
            type: 'negative',
            message: `Could not convert messages into chats. Reason: ${error.message}`,
          });
        }
      }
    }

    onMounted(async () => {
      if (route.params.myPrivateKeyID) {
        myPrivateKeyID.value = route.params.myPrivateKeyID as string
        theirPublicKeyID.value = route.params.theirPublicKeyID as string

        if (publicKey.value) {
          await processInboxChange();
        }
      }
    })

    const submitMessage = async () => {
      // Determine if message () or plain text (from me to them)
      const isMessage = await isValidMessage(text.value)
      
      try {
        if (isMessage) {
          await processMessage(text.value)
        } else {
          const { theirEncryptedMessage } = await myCreateMessage(text.value, theirPublicKeyID.value, myPrivateKeyID.value)
          await addToClipboard({label: 'Encrypted message copied to clipboard', value: theirEncryptedMessage})
        }
      } catch (exception: unknown) {
        const error = exception as Error;
        $q.notify({
          type: 'negative',
          message: `Could not process message. Reason: ${error.message}`,
        });
      }
      text.value = '';
    }

    return {
      hasEncryptedMessages: computed(() => ChatsModule.hasEncryptedMessages(myPrivateKeyID.value)),
      text,
      chats,
      theirPublicKeyID,
      publicKey,
      rowClick: (id: string) => router.push({ name: 'history' , params: { id } }),
      clickMessage: () => console.log('Message clicked!'),
      submitMessage,
      retryDecryption: async () => await processInboxChange(),
      goBack: () => router.push({ name: 'chats' , params: { myPrivateKeyID: myPrivateKeyID.value } }),
    };
  }
});
</script>
