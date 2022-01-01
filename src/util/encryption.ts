import {readKey, decryptKey, readPrivateKey, encrypt, decrypt, createMessage, readMessage, generateKey, EllipticCurveName, KeyOptions, UserID, EncryptOptions, Message, MaybeStream, Data, DecryptOptions, sign, verify, VerifyOptions, readSignature, PrivateKey, PublicKey } from 'openpgp';
import { Dialog } from 'quasar'

export interface CombinedKeyPair {
  publicKey: PublicKey;
  privateKey?: PrivateKey;
  revocationCertificate?: string;
}

export interface CombinedEncryptionOptions extends EncryptOptions {
  message: Message<MaybeStream<Data>>;
  format?: 'armored' | undefined;
}

export interface IDecryptionResult {
  verified: boolean
  decrypted: string
}

// Pulled from OpenPGP's own email regex
export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+([a-zA-Z]{2,}|xn--[a-zA-Z\-0-9]+)))$/;
export const createTypeOptions = ['ecc', 'rsa']
export const createCurveOptions = ['ed25519', 'curve25519', 'p256', 'p384', 'p521', 'secp256k1', 'brainpoolP256r1', 'brainpoolP384r1', 'brainpoolP512r1']

export async function createKeys(name: string, email: string, passphrase: string, type: KeyOptions['type'] = 'ecc', curve: EllipticCurveName = 'curve25519', userIDs: UserID[] = []): Promise<CombinedKeyPair> {
  // advanced types, curves, format 
  return await generateKey({
      type, // Type of the key, defaults to ECC
      curve, // ECC curve name, defaults to curve25519
      userIDs: [...userIDs, { name, email }], // you can pass multiple user IDs
      passphrase, // protects the private key
      format: 'object' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });
}

async function requestPassphrase ({username} = {username: ''}): Promise<string | undefined> {
  return await new Promise(resolve => Dialog.create({
    title: `Unlocking private key for ${username}`,
    message: 'Passphrase?',
    prompt: {
      model: '',
      type: 'text'
    },
    cancel: true  }).onOk((data: string)=>{
      return resolve(data)
    }).onCancel(()=>resolve(undefined)));
}

export const readImportedKey = (armoredKey: string) => readKey({armoredKey})

export async function encryptMessage(body: string, publicKey: string, privateKey?: string): Promise<string> {
  const resolvedPublicKey = await readKey({ armoredKey: publicKey });
  const message = await createMessage({ text: body });
  const encryptBody = {
    message,
    encryptionKeys: resolvedPublicKey,
  } as CombinedEncryptionOptions

  if (privateKey) {
    const resolvedPrivateKey = await readPrivateKey({ armoredKey: privateKey });
    const passphrase = await requestPassphrase({username: resolvedPrivateKey.getUserIDs().join(', ')});

    if (passphrase === null) {
      return ''; 
    }
    
    const decryptedPrivateKey = await decryptKey({
      privateKey: resolvedPrivateKey,
      passphrase
    });

    encryptBody.signingKeys = decryptedPrivateKey
  }

  return await encrypt(encryptBody) as string;
}

export async function decryptMessage(encryptedBody: string, privateKey: string, publicKey?: string): Promise<IDecryptionResult> {
  const resolvedPrivateKey = await readPrivateKey({ armoredKey: privateKey });

  const passphrase = await requestPassphrase({username: resolvedPrivateKey.getUserIDs().join(', ')});
  const decryptedPrivateKey = await decryptKey({
    privateKey: resolvedPrivateKey,
    passphrase
  });

  const message = await readMessage({
      armoredMessage: encryptedBody // parse armored message
  });

  const decryptBody = {
    message,
    decryptionKeys: decryptedPrivateKey,
  } as DecryptOptions

  if (publicKey) {
    const resolvedPublicKey = await readKey({ armoredKey: publicKey });

    decryptBody.expectSigned = true;
    decryptBody.verificationKeys = resolvedPublicKey;
  }

  const { data: decrypted, signatures} = await decrypt(decryptBody)

  let verified = undefined;

  if (publicKey) {
    await signatures[0].verified;
    verified = true;
  }

  return { decrypted, verified } as IDecryptionResult;
}

export async function signMessage(body: string, privateKey: string): Promise<string> {

  const resolvedPrivateKey = await readPrivateKey({ armoredKey: privateKey });
  const passphrase = await requestPassphrase({username: resolvedPrivateKey.getUserIDs().join(', ')});
  const decryptedPrivateKey = await decryptKey({
    privateKey: resolvedPrivateKey,
    passphrase
  });

  const message = await createMessage({ text: body });
  const cleartextMessage  = await sign({
    message,
    signingKeys: decryptedPrivateKey,
    detached: true
  });

  return cleartextMessage;
}

export async function verifyMessage(body: string, publicKey: string, detachedSignature: string): Promise<boolean> {
  const resolvedPublicKey = await readKey({ armoredKey: publicKey });
  const message = await createMessage({ text: body });
  const signature = await readSignature({
      armoredSignature: detachedSignature // parse detached signature
  });

  type Options = VerifyOptions & { message: Message<MaybeStream<Data>>} 
  const verifyBody: Options = {
    verificationKeys: resolvedPublicKey,
    message,
    signature
  } 

  const verificationResult = await verify(verifyBody);
  const { verified } = verificationResult.signatures[0];
  await verified; // throws on invalid signature

  return true;
}

export async function getPrivateKeyId(key: string) {
  const keys = await readKey({ armoredKey: key })
  const encryptionKey =  await keys.getEncryptionKey();
  return encryptionKey.getKeyID().toHex();
}

export async function getPublicKeyId(key: string) {
  const keys = await readKey({ armoredKey: key })
  const signingKey =  await keys.getSigningKey();
  return signingKey.getKeyID().toHex();
}

export async function getUserIDs(key: string) {
  const keys = await readKey({ armoredKey: key })
  return keys.users.map(user => user.userID?.userID);
}
