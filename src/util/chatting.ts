import { createMessage, decrypt, decryptKey, encrypt, readKey, readMessage, readPrivateKey } from 'openpgp';
import { requestPassphrase } from 'app/src/util/encryption'
import { KeysModule } from 'src/store/keys';
import { ChatsModule, IChat, IMessage, verificationKeys } from 'src/store/chats';

export interface IMyChat {
  theirPublicKeyID: string;
  chat: string;
}

export async function myCreateMessage(input: string, theirPublicKeyID: string, myPrivateKeyID: string) {
  const error = '';
  // PGP does not save the public keyid of who we want to message 
  // when we save our own message so lets put that public keyid 
  // in our own message
  const selfInput = {
    theirPublicKeyID: theirPublicKeyID,
    chat: input
  } as IMyChat
  const selfInputString = JSON.stringify(selfInput);
  const selfMessage = await createMessage({ text: selfInputString})
  
  const message = await createMessage({ text: input });

  const theirPublicKey = KeysModule.getPublicKeys.find(publicKey => publicKey.keyID === theirPublicKeyID);

  if (!theirPublicKey) {
    throw new Error(`Could not find the public key for ${theirPublicKeyID}`);
  }

  const theirResolvedPublicKey = await readKey({armoredKey: theirPublicKey.key});

  const myPrivateKey = KeysModule.getPrivateKeys.find(privateKey => privateKey.keyID === myPrivateKeyID);

  if (!myPrivateKey) {
    throw new Error(`Could not find the private key for ${myPrivateKeyID}`);
  }

  const resolvedPrivateKey = await readPrivateKey({ armoredKey: myPrivateKey.key });
  const passphrase = await requestPassphrase({username: resolvedPrivateKey.getUserIDs().join(', ')});

  if (passphrase === null) {
    throw new Error('Passphrase is required');
  }
  
  const decryptedPrivateKey = await decryptKey({
    privateKey: resolvedPrivateKey,
    passphrase
  });

  const myPublicKey = decryptedPrivateKey.toPublic();
  
  const theirEncryptedMessage = await encrypt({
    message,
    encryptionKeys: theirResolvedPublicKey,
    signingKeys: decryptedPrivateKey
  });

  const myEncryptedMessage = await encrypt({
    message: selfMessage,
    encryptionKeys: myPublicKey,
    signingKeys: decryptedPrivateKey
  });

  const readingMessage = await readMessage({armoredMessage: myEncryptedMessage});

  const decryptedResult = await decrypt({
    message: readingMessage,
    decryptionKeys: decryptedPrivateKey,
  })

  const subsignature = await decryptedResult.signatures[0].signature;

  const { created } = subsignature.packets[0];

  return {
    theirEncryptedMessage,
    chat: {
      detail: {
        theirPublicKeyID,
        myPrivateKeyID,
        verification: 'self',
        userID: theirResolvedPublicKey.getUserIDs().join(', '),
        chatUserID: decryptedPrivateKey.getUserIDs().join(', '),
        createdDate: created,
      },
      chat: input
    } as IChat,
    message: {
      detail: {
        myPrivateKeyID,
      },
      message: myEncryptedMessage
    } as IMessage,
    error
  }
}

export async function processMessage(encryptedMessage: string) {

  let verification;

  const readingMessage = await readMessage({armoredMessage: encryptedMessage});

  const myPrivateKeyIDs = readingMessage.getEncryptionKeyIDs().map(record => record.toHex())
  const myPrivateKeyID = myPrivateKeyIDs[0];

  const myPrivateKey = KeysModule.getPrivateKeys.find(privateKey => privateKey.keyID === myPrivateKeyID);

  if (!myPrivateKey) {
    throw new Error(`Could not find the private key for ${myPrivateKeyIDs[0]}`);
  }

  const resolvedPrivateKey = await readPrivateKey({ armoredKey: myPrivateKey.key });
  const passphrase = await requestPassphrase({username: resolvedPrivateKey.getUserIDs().join(', ')});

  if (passphrase === null) {
    return ''; 
  }
  
  const decryptedPrivateKey = await decryptKey({
    privateKey: resolvedPrivateKey,
    passphrase
  });

  const decryptedResult = await decrypt({
    message: readingMessage,
    decryptionKeys: decryptedPrivateKey,
  })
  
  const subsignature = await decryptedResult.signatures[0].signature;
  const { created } = subsignature.packets[0];

  const theirPublicKeyID = decryptedResult.signatures[0].keyID.toHex()

  const theirPublicKey = KeysModule.getPublicKeys.find(publicKey => publicKey.keyID === theirPublicKeyID);

  if (!theirPublicKey) {
    verification = 'not_found';
  } else {
    const theirResolvedPublicKey = await readKey({armoredKey: theirPublicKey.key});
    const readingMessageSecond = await readMessage({armoredMessage: encryptedMessage}); // Need to read again due to pgp limitation https://github.com/openpgpjs/openpgpjs/issues/1461
    const decryptedVerifiedResult = await decrypt({
      message: readingMessageSecond,
      decryptionKeys: decryptedPrivateKey,
      verificationKeys: theirResolvedPublicKey,
    })

    const verified = await decryptedVerifiedResult.signatures[0].verified;
    verification = verified ? 'verified' : 'failed';
  }

  ChatsModule.addChat({chat: {
    chat: decryptedResult.data,
    detail: {
      myPrivateKeyID,
      theirPublicKeyID,
      verification,
      userID: theirPublicKey ? theirPublicKey.userID : '',
      chatUserID: theirPublicKey ? theirPublicKey.userID : '',
      createdDate: created
    }
  } as IChat})

  ChatsModule.addMessage({message: {
    detail: {
      myPrivateKeyID,
    },
    message: encryptedMessage
  }})

  return {
    chat: decryptedResult.data,
    detail: {
      myPrivateKeyID,
      theirPublicKeyID,
      verification,
      userID: theirPublicKey ? theirPublicKey.userID : '',
      chatUserID: theirPublicKey ? theirPublicKey.userID : '',
      createdDate: created
    }
  } as IChat
}

export async function processMessagesToChats(myPrivateKeyID: string): Promise<void> {
  const messages = ChatsModule.getMessages.filter(message => {
    return message.detail.myPrivateKeyID === myPrivateKeyID
  });

  const myPrivateKey = KeysModule.getPrivateKeys.find(privateKey => privateKey.keyID === myPrivateKeyID);

  if (!myPrivateKey) {
    throw new Error(`Could not find the private key for ${myPrivateKeyID}`);
  }

  const resolvedPrivateKey = await readPrivateKey({ armoredKey: myPrivateKey.key });
  const passphrase = await requestPassphrase({username: resolvedPrivateKey.getUserIDs().join(', ')});

  if (passphrase === null) {
    throw new Error('Passphrase is required');
  }
  
  const decryptedPrivateKey = await decryptKey({
    privateKey: resolvedPrivateKey,
    passphrase
  });

  const chats = await Promise.all(messages.map(async message => {
    let verification: verificationKeys;

    const readingMessage = await readMessage({armoredMessage: message.message});
    const decryptedResult = await decrypt({
      message: readingMessage,
      decryptionKeys: decryptedPrivateKey,
    })

    let decryptedMessage = decryptedResult.data
  
    const subsignature = await decryptedResult.signatures[0].signature;
    const { created } = subsignature.packets[0];

    let theirPublicKeyID = decryptedResult.signatures[0].keyID.toHex()
    const theirPublicKey = KeysModule.getPublicKeys.find(publicKey => publicKey.keyID === theirPublicKeyID);
    let userID = theirPublicKey ? theirPublicKey.userID : '';

    if (!theirPublicKey) {
      verification = 'not_found';
    } else {
      const theirResolvedPublicKey = await readKey({armoredKey: theirPublicKey.key});
      const readingMessageSecond = await readMessage({armoredMessage: message.message}); // Need to read again due to pgp limitation https://github.com/openpgpjs/openpgpjs/issues/1461

      const decryptedVerifiedResult = await decrypt({
        message: readingMessageSecond,
        decryptionKeys: decryptedPrivateKey,
        verificationKeys: theirResolvedPublicKey,
      })

      const verified = await decryptedVerifiedResult.signatures[0].verified;
      verification = verified ? 'verified' : 'failed';
    }

    // Lets determine if the message was from us
    if (verification === 'verified' && resolvedPrivateKey.toPublic().getKeyID().toHex() === theirPublicKeyID) {
      verification = 'self';
      const messageObject = JSON.parse(decryptedMessage) as IMyChat;

      if (messageObject.chat) {
        decryptedMessage = messageObject.chat
      }

      if (messageObject.theirPublicKeyID) {
        theirPublicKeyID = messageObject.theirPublicKeyID;
        const theirActualPublicKey = KeysModule.getPublicKeys.find(publicKey => publicKey.keyID === theirPublicKeyID);
        
        userID = theirActualPublicKey ? theirActualPublicKey.userID : theirPublicKeyID
      }
    }
    
    return {
      chat: decryptedMessage,
      detail: {
        myPrivateKeyID,
        theirPublicKeyID,
        verification,
        userID,
        chatUserID: theirPublicKey ? theirPublicKey.userID : '',
        createdDate: created
      }
    } as IChat
  }))

  ChatsModule.initialiseChats(chats);
}
