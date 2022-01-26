<template>
  <q-page>
    <q-banner class="bg-primary text-white row full-width">
      <div class="fit row justify-between items-center">
        <div>
          <q-btn round icon="arrow_circle_left" @click="goBack" />
        </div>
        <div>
          {{publicKey?.userID}}
        </div>
        <div>
          <q-btn round icon="help">
            <q-tooltip class="text-subtitle1" style="max-width: 70vw">
              Write a message and it will be automatically encrypted with your private key and copied to your clipboard.<br />
              Add their message and it will be automatically decrypted with your private key and available here.
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-banner>
    <span v-if="!publicKey">
      No public key could be found. Have you added their public key?
    </span>
    <span v-else-if="hasEncryptedMessages">
      There are messages that are currently encrypted.
      <q-btn color="primary" @click="retryDecryption">Try decrypting again</q-btn>
    </span>
    <div v-else style="width: 100%;">
      <q-chat-message
        v-for="(chat, index) in chats" 
        :key="index"
        v-bind="chat"
        :name="chat.detail.chatUserID"
        :text="[chat.chat]"
        :sent="chat.detail.verification === 'self'"
        :text-color="chat.detail.verification === 'self' ? 'white' : 'black'"
        :bg-color="chat.detail.verification === 'self' ? 'primary' : 'grey-4'"
        clickable
        @click="chat.detail.verification === 'self' && clickMessage(chat.chat)"
        exact
      >
        <template v-slot:stamp>
          {{timestamp(chat.detail.createdDate)}}
          <span v-if="chat.detail.verification !== 'self'">
            <q-icon v-if="chat.detail.verification === 'verified'" name="check_circle_outline" color="positive">
              <q-tooltip>
                The signature verification succeeded for their public key ({{theirPublicKeyID}})
              </q-tooltip>
            </q-icon>
            <q-icon v-else name="error_outline" color="negative">
              <q-tooltip v-if="chat.detail.verification === 'not_found'">
                There was no matching public key found for their public key ({{theirPublicKeyID}})
              </q-tooltip>
              <q-tooltip>
                The signature verification failed for their public key ({{theirPublicKeyID}})
              </q-tooltip>
            </q-icon>
          </span>
        </template>
      </q-chat-message>
      <q-input bottom-slots v-model="inputChat" type="textarea" hint="Write your message or add their PGP Message here">
        <template v-slot:append>
          <q-icon v-if="inputChat !== ''" name="close" @click="inputChat = ''" class="cursor-pointer" />
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="submitMessage" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { myCreateMessage, processMessage, processMessagesToChats } from 'src/util/chatting'
import { myReadMessage } from 'src/util/encryption'
import { addToClipboard } from 'src/util/clipboard'
import { ChatsModule } from 'src/store/chats';
import { KeysModule } from 'src/store/keys';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const isValidMessage = async (message: string) => {
  try {
    await myReadMessage({ armoredMessage: message });
    return true;
  } catch (error: unknown) {
    return false;
  }
}

const timestamp = (dateObj: Date | undefined) => {
  return dateObj ? dayjs().to(dayjs(dateObj)) : undefined
}

export default defineComponent({
  name: 'Chats',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const myPrivateKeyID = ref('');
    const theirPublicKeyID = ref('');
    const inputChat = ref('');

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
      const isMessage = await isValidMessage(inputChat.value)
      
      try {
        if (isMessage) {
          await processMessage(inputChat.value)
        } else {
          const { chat, message } = await encryptMessage();
          ChatsModule.addChat({chat})
          ChatsModule.addMessage({message})
        }
      } catch (exception: unknown) {
        const error = exception as Error;
        $q.notify({
          type: 'negative',
          message: `Could not process message. Reason: ${error.message}`,
        });
      }
      inputChat.value = '';
    }

    const encryptMessage = async (text?: string) => {
      const { theirEncryptedMessage, chat, message } = await myCreateMessage(text ? text : inputChat.value, theirPublicKeyID.value, myPrivateKeyID.value)
      await addToClipboard({label: 'Encrypted message', value: theirEncryptedMessage})
      return { chat, message }
    }

    return {
      hasEncryptedMessages: computed(() => ChatsModule.hasEncryptedMessages(myPrivateKeyID.value)),
      inputChat,
      chats,
      theirPublicKeyID,
      publicKey,
      timestamp,
      rowClick: (id: string) => router.push({ name: 'history' , params: { id } }),
      clickMessage: encryptMessage,
      submitMessage,
      retryDecryption: async () => await processInboxChange(),
      goBack: () => router.push({ name: 'chats' , params: { myPrivateKeyID: myPrivateKeyID.value } }),
    };
  }
});
</script>
