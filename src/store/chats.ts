import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from 'src/store';
import { MESSAGE_KEY } from 'src/util/constants';

export interface IEncryptedDetail {
  myPrivateKeyID: string;
}

export type verificationKeys = 'verified' | 'failed' | 'not_found' | 'self' | 'invalid_pgp_message';

// By Design, PGP does not expose the below details, lets do the same
export interface IUnencryptedDetail extends IEncryptedDetail {
  theirPublicKeyID: string;
  verification: verificationKeys;
  userID: string;
  chatUserID: string;
  createdDate?: Date;
}

export interface IMessage {
  message: string;
  detail: IEncryptedDetail;
}

export interface IChat {
  chat: string;
  detail: IUnencryptedDetail;
}

export interface ChatsStateInterface {
  messages: IMessage[];
  chats: IChat[];
}

export const restoreMessagessFromLocalStorage = () => window.localStorage.getItem(MESSAGE_KEY) !== 'undefined' ? JSON.parse(window.localStorage.getItem(MESSAGE_KEY) || '[]') as IMessage[] : []

const sortByCreated = (chats: IChat[]) => chats.sort((chatA, chatB) => chatA.detail.createdDate && chatB.detail.createdDate ? +chatA.detail.createdDate - +chatB.detail.createdDate : 0);

@Module({
  dynamic: true,
  namespaced: true,
  name: 'chats',
  store,
})
export default class Chats extends VuexModule {
  public chats: IChat[] = []
  public messages: IMessage[] = []

  @Mutation
  addChat(payload: { chat: IChat }) {
    const { chat } = payload
    this.chats.push(chat);
  }

  @Mutation
  addMessage(payload: { message: IMessage }) {
    const { message } = payload
    this.messages.push(message);
  }

  @Mutation
  removeChat(payload: { chat: IChat }) {
    const { chat } = payload
    this.chats = this.chats.filter(chatRecord => chatRecord.chat !== chat.chat);
  }

  @Mutation
  removeMessage(payload: { message: IMessage }) {
    const { message } = payload
    this.messages = this.messages.filter(messageRecord => messageRecord.message !== message.message);
  }
  
  @Mutation
  initialiseMessages(messages: IMessage[]) {
    this.messages = messages;
  }
  
  @Mutation
  initialiseChats(chats: IChat[]) {
    this.chats = sortByCreated(chats);
  }
  
  get getChats () {
    return this.chats;
  }

  get getChatsByPrivateKeyID () {
    return (privateKeyID: string) => this.chats.filter(chat => {
      return chat.detail.myPrivateKeyID === privateKeyID
    })
  }

  get getChatsByPrivateKeyIDAndPublicKeyID () {
    return (privateKeyID: string, publicKeyID: string) => this.chats.filter(chat => {
      return chat.detail.myPrivateKeyID === privateKeyID && chat.detail.theirPublicKeyID === publicKeyID
    })
  }

  get getUniqueChatsByPrivateKeyID () {
    return (privateKeyID: string) => {
      const chats = this.getChatsByPrivateKeyID(privateKeyID)
      return [...new Map(chats.map(item => [item.detail.theirPublicKeyID, item])).values()];
    }
  }

  get getMessages () {
    return this.messages;
  }

  get getMessagesByPrivateKeyID () {
    return (privateKeyID: string) => this.messages.filter(message => {
      return message.detail.myPrivateKeyID === privateKeyID
    })
  }

  get hasEncryptedMessages () {
    return (privateKeyID: string | undefined) => {
      if (privateKeyID) {
        return this.getMessagesByPrivateKeyID(privateKeyID).length > 0 && this.getChatsByPrivateKeyID(privateKeyID).length === 0
      } else {
        return this.getMessages.length > 0 && this.chats.length === 0
      }
    }
  }
}

store.subscribe(({type}, {chats}) => {
  // Lets not overwrite our local store when initialising
  if (type.substring(0, 5) === 'chats' && type !== 'chats/initialiseMessages') {
    window.localStorage.setItem(MESSAGE_KEY, JSON.stringify(chats.messages))
  }
})

export const ChatsModule = getModule(Chats)
