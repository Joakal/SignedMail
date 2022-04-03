import {readKey, encrypt, decrypt, createMessage, readMessage, generateKey, EllipticCurveName, KeyOptions, UserID, EncryptOptions, Message, MaybeStream, Data, DecryptOptions, sign, verify, VerifyOptions, readSignature, PrivateKey, PublicKey, PartialConfig, readPrivateKey } from 'openpgp';
import { Dialog } from 'quasar'
import { defineAsyncComponent } from 'vue';

export interface StoredKeyPair {
  publicKeyArmor: string;
  privateKeyArmor?: string;
  revocationCertificate?: string;
}

export interface CombinedKeyPair {
  publicKey: PublicKey;
  privateKey?: PrivateKey; // Gotcha: Do not try to get .armor() of privateKey directly because passphrase will not be in it
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

function friendlyPgpEncryptionWrapper(message: string) {
  if (message === 'Misformed armored text') {
    return 'This is not a valid PGP message or key';
  }

  return message;
}

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

export async function resolvePrivateKey(privateKeyString: string) {
  let decryptedPrivateKey;
  const resolvedPrivateKey = await myReadPrivateKey({ armoredKey: privateKeyString });

  if (resolvedPrivateKey.isDecrypted()) {
    console.error('Resolved private key without passphrase, please consider adding a passphrase to the private key');
    decryptedPrivateKey = resolvedPrivateKey;
  } else {
    // Override Quasar's default dialog with our component due to no option for conditional dialog close on clicking OK
    decryptedPrivateKey = await new Promise(resolve => Dialog.create({
      component: defineAsyncComponent(() => import('./PrivateKeyDialog.vue')),
      componentProps: {
        privateKeyString
      }
    }).onOk((data: string)=> resolve(data)));
  }

  return decryptedPrivateKey as PrivateKey
}


export async function encryptMessage(body: string, publicKey: string, privateKey?: string): Promise<string> {
  const resolvedPublicKey = await myReadKey({ armoredKey: publicKey });
  const message = await createMessage({ text: body });
  const encryptBody = {
    message,
    encryptionKeys: resolvedPublicKey,
  } as CombinedEncryptionOptions

  if (privateKey) {
    const decryptedPrivateKey = await resolvePrivateKey(privateKey)

    encryptBody.signingKeys = decryptedPrivateKey
  }

  return await encrypt(encryptBody) as string;
}

export async function decryptMessage(encryptedBody: string, privateKey: string, publicKey?: string): Promise<IDecryptionResult> {
  const decryptedPrivateKey = await resolvePrivateKey(privateKey)

  const message = await myReadMessage({
      armoredMessage: encryptedBody // parse armored message
  });

  const decryptBody = {
    message,
    decryptionKeys: decryptedPrivateKey,
  } as DecryptOptions

  if (publicKey) {
    const resolvedPublicKey = await myReadKey({ armoredKey: publicKey });

    decryptBody.expectSigned = true;
    decryptBody.verificationKeys = resolvedPublicKey;
  }

  const { data: decrypted, signatures} = await decrypt(decryptBody)

  let verified = false;

  if (publicKey) {
    await signatures[0].verified;
    verified = true;
  }

  return { decrypted, verified } as IDecryptionResult;
}

export async function signMessage(body: string, privateKey: string): Promise<string> {
  const decryptedPrivateKey = await resolvePrivateKey(privateKey)

  const message = await createMessage({ text: body });
  const cleartextMessage  = await sign({
    message,
    signingKeys: decryptedPrivateKey,
    detached: true
  });

  return cleartextMessage;
}

export async function verifyMessage(body: string, publicKey: string, detachedSignature: string): Promise<boolean> {
  const resolvedPublicKey = await myReadKey({ armoredKey: publicKey });
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

export async function getKeyId(armoredKey: string) {
  const key = await myReadKey({ armoredKey })
  return key.getKeyID().toHex();
}

export async function getPublicKeyIdByPrivateKey(privateArmoredKey: string) {
  const keys = await myReadKey({ armoredKey: privateArmoredKey })
  const signingKey =  await keys.getSigningKey();
  return signingKey.getKeyID().toHex();
}

export async function getUserIDs(armoredKey: string) {
  const keys = await myReadKey({ armoredKey })
  return keys.users.map(user => user.userID?.userID);
}

type ArmoredOptions = {
  armoredKey: string;
  config?: PartialConfig | undefined;
}

export const myReadKey = async (options: ArmoredOptions) => {
  try { 
    return await readKey(options)
  } catch (error: unknown) {
    const {message} = error as Error;
    throw new Error(friendlyPgpEncryptionWrapper(message))
  }
}

export const myReadPrivateKey = async (options: ArmoredOptions) => {
  try { 
    return await readPrivateKey(options);
  } catch (error: unknown) {
    const {message} = error as Error;
    throw new Error(friendlyPgpEncryptionWrapper(message))
  }
}

export const myReadMessage = async ({armoredMessage}: {armoredMessage: string}) => {
  try { 
    return await readMessage({
      armoredMessage // parse armored message
    });
  } catch (error: unknown) {
    const {message} = error as Error;
    throw new Error(friendlyPgpEncryptionWrapper(message))
  }
}