<template>
  <q-page>
    <q-banner class="bg-primary text-white">
      <div class="fit row justify-between items-center">
        <div />
        <div>
          {{privateKey?.userID}} Chats 
        </div>
        <div>
          <q-btn round icon="help">
            <q-tooltip class="text-subtitle1" style="max-width: 70vw">
              Once you start a conversation on the device, it will be listed here
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-banner>
    <span v-if="hasEncryptedMessages">
      There are messages that are currently encrypted.
      <q-btn color="primary" @click="retryDecryption">Try decrypting again</q-btn>
    </span>
    <span v-else-if="uniqueChats.length === 0">
      No chats found. Start one below from the list.
    </span>
    <q-list v-else dense bordered padding class="rounded-borders">
      <q-item 
        v-for="chat in uniqueChats"
        :key="chat.detail.theirPublicKeyID"
        v-bind="chat"
        clickable
        v-ripple
        @click="rowClick(chat.detail.theirPublicKeyID)"
        >
        <q-item-section>
          <span>
            {{chat.detail.userID}}
          </span>
          <span>
            {{chat.detail.createdDate}}
          </span>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="row q-pa-sm q-gutter-md">
      <q-select
        filled
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="publicKeyOptions"
        hint="Public Keys"
        option-value="keyID"
        option-label="userID"
        @filter="publicKeyFilterFn"
        v-model="publicKeySelected"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="row q-gutter-md">
      <q-btn color="primary" label="Start chat" @click="startChat" :disable="!publicKeySelected" />
      <q-btn color="secondary" label="New Public Key" @click="addNewKey = true"  />
    </div>
    <q-dialog v-model="addNewKey" title="HELO">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Add a key</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="keyValueInput" filled type="textarea" label="Public or Private Key" :error="!!handleAddKeyError.length" :error-message="handleAddKeyError" />
          <q-file
            label="Import a private key"
            @update:model-value="handleImport"
          />
          <q-btn color="primary" label="Add Key" @click="handleAddKey" />
          <div class="q-pa-md row" v-if="showKeys">
            <ShowKeys :keys="showKeys" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Key } from 'openpgp';
import { defineComponent, defineAsyncComponent, ref, Ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChatsModule } from 'src/store/chats';
import { IKeyRecord, KeysModule } from 'src/store/keys';
import { processMessagesToChats } from 'src/util/chatting';
import { StoredKeyPair, myReadKey } from 'src/util/encryption';

export default defineComponent({
  name: 'Chats',
  components: {
    ShowKeys: defineAsyncComponent(() => import('components/ShowKeys.vue'))
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const myPrivateKeyID = ref('');
    const keyValueInput = ref('');
    const addNewKey = ref(false);
    const handleAddKeyError = ref('')
    const publicKeySelected: Ref<IKeyRecord | undefined> = ref();
    const publicKeyOptions: Ref<IKeyRecord[]> = ref([]);
    const publicKeys: Ref<IKeyRecord[]> = ref([]);
    const showKeys: Ref<StoredKeyPair | undefined> = ref(undefined);

    const chats = computed(() => ChatsModule.getChatsByPrivateKeyID(myPrivateKeyID.value));
    const uniqueChats = computed(() => ChatsModule.getUniqueChatsByPrivateKeyID(myPrivateKeyID.value));
    const messages = computed(() => ChatsModule.getMessagesByPrivateKeyID(myPrivateKeyID.value));
    const privateKey = computed(() => KeysModule.getPrivateKeyByKeyID(myPrivateKeyID.value));

    const publicKeyFilterFn = (inputValue: string, doneFn: (callBackFn: () => void) => void) => {
      if (inputValue === '') {
        doneFn(() => {
          publicKeyOptions.value = publicKeys.value
        })
        return
      }
      doneFn(() => {
        const needle = inputValue.toLowerCase()
        publicKeyOptions.value = publicKeys.value.filter(v => v.userID.toLowerCase().indexOf(needle) > -1)
      })
    };

    const processInboxChange = async () => {
      myPrivateKeyID.value = route.params.myPrivateKeyID as string
      publicKeyOptions.value = await KeysModule.getOtherPublicKeysByPrivateKeyID(myPrivateKeyID.value)
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
    
    const handleAddKey = async () => {
      handleAddKeyError.value = '';
      const publicKeys = computed(() => KeysModule.getPublicKeys);
      const privateKeys = computed(() => KeysModule.getPrivateKeys);
      const publicKeyExists = (key: Key) => publicKeys.value.find(publicKey => publicKey.keyID === key.getKeyID().toHex())
      const privateKeyExists = (key: Key) => privateKeys.value.find(privateKey => privateKey.keyID === key.getKeyID().toHex())
      let keyValue;

      try {
        keyValue = await myReadKey({armoredKey: keyValueInput.value})
      } catch (error: unknown) {
        const {message} = error as Error;
        handleAddKeyError.value = message;
      }
      if (!keyValue) {
        return;
      }

      if (keyValue.isPrivate() && privateKeyExists(keyValue) || publicKeyExists(keyValue)) {
        $q.notify({
          type: 'negative',
          message: 'This key already exists locally',
        });
      } else {
        await KeysModule.importPublicKey({armoredKey: keyValueInput.value});
      }

      showKeys.value = { publicKeyArmor: keyValueInput.value };
    };

    const handleImport = (file: Blob) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        keyValueInput.value = event.target?.result ? event.target.result as string : ''; 
      }
      reader.readAsText(file);
    }

    onMounted(async () => {
      if (route.params.myPrivateKeyID) {
        await processInboxChange();
      }
    })
    
    watch(() => route.params.myPrivateKeyID, async () => {
      await processInboxChange();
    });

    watch(myPrivateKeyID, async () => {
      if (myPrivateKeyID.value) {
        publicKeys.value = await KeysModule.getOtherPublicKeysByPrivateKeyID(myPrivateKeyID.value)
      }
    });

    return {
      addNewKey,
      keyValueInput,
      showKeys,
      handleImport,
      handleAddKey,
      handleAddKeyError,
      hasEncryptedMessages: computed(() => ChatsModule.hasEncryptedMessages(myPrivateKeyID.value)),
      uniqueChats,
      rowClick: (theirPublicKeyID: string) => router.push({ name: 'chat' , params: { theirPublicKeyID } }),
      startChat: () => publicKeySelected.value ? router.push({ name: 'chat' , params: { theirPublicKeyID: publicKeySelected.value.keyID } }) : null,
      publicKeyOptions,
      publicKeySelected,
      publicKeyFilterFn,
      privateKey,
      retryDecryption: async () => await processInboxChange(),
    };
  }
});
</script>
