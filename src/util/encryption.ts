import {readKey, decryptKey, readPrivateKey, encrypt, decrypt, createMessage, readMessage, generateKey, KeyPair} from 'openpgp';

export const variable = true;


export function sayit (): string {
  console.log("Say it isn't so")
  return 'Greatness'
}

export async function testEncrypt(): Promise<string> {
  console.log('Starting TestEncrypt')
  // put keys in backtick (``) to avoid errors caused by spaces or tabs
  const publicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEYXVMqBYJKwYBBAHaRw8BAQdAij5SoU96xQzuyU8w5uzP4GmhLcVgoFiQ
bCo1szdEkb3NFHRlc3QgPHRlc3RAdGVzdC5jb20+wowEEBYKAB0FAmF1TKgE
CwkHCAMVCAoEFgACAQIZAQIbAwIeAQAhCRAr+AxhxV2RGhYhBAyVpk1kPDTF
9VNsrCv4DGHFXZEa3D0A/3uA0kQmV/di7iS4e1uVm+ENlwhFv8mpHRWm1wzK
lKQ+APwOqNtU5H4lAoz7e2WkVUMMQdNnMAgBfJof9Wd8zKYLDs44BGF1TKgS
CisGAQQBl1UBBQEBB0Cs0EC73GY32D7tHAyxKco8JdGVaBYJhFStbwJBjYKh
UwMBCAfCeAQYFggACQUCYXVMqAIbDAAhCRAr+AxhxV2RGhYhBAyVpk1kPDTF
9VNsrCv4DGHFXZEawvkBAIFta8bqo7OLjObB3d5gAD1DJJWItgbw09DD3Pqr
TWnaAP9bwCnNJMnF0QAHEGo83XdJtG9/xJeAB9sHb98wx3TCAA==
=ykUZ
-----END PGP PUBLIC KEY BLOCK-----`;
const privateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xYYEYXVMqBYJKwYBBAHaRw8BAQdAij5SoU96xQzuyU8w5uzP4GmhLcVgoFiQ
bCo1szdEkb3+CQMIlxEejQeXjIvgxNpRuuaLlPRu0qrh2hgJZhEy7yfSB9pS
tM8nPEyFHL37E36S+cXBpEyCmx+QNY6RYwGoNDFR/28CGEcRo3fHxIEwrG8Y
Pc0UdGVzdCA8dGVzdEB0ZXN0LmNvbT7CjAQQFgoAHQUCYXVMqAQLCQcIAxUI
CgQWAAIBAhkBAhsDAh4BACEJECv4DGHFXZEaFiEEDJWmTWQ8NMX1U2ysK/gM
YcVdkRrcPQD/e4DSRCZX92LuJLh7W5Wb4Q2XCEW/yakdFabXDMqUpD4A/A6o
21TkfiUCjPt7ZaRVQwxB02cwCAF8mh/1Z3zMpgsOx4sEYXVMqBIKKwYBBAGX
VQEFAQEHQKzQQLvcZjfYPu0cDLEpyjwl0ZVoFgmEVK1vAkGNgqFTAwEIB/4J
Awi0mhnvvuewe+BC7E3+103ZNyHnuZZK8iov9U2P+8gXk0V/rXOMf20abEr5
VPlIEClbE4wqUqCEmm0fZ0s1mBgc+eejYrcoXUHOt0MR1I/twngEGBYIAAkF
AmF1TKgCGwwAIQkQK/gMYcVdkRoWIQQMlaZNZDw0xfVTbKwr+AxhxV2RGsL5
AQCBbWvG6qOzi4zmwd3eYAA9QySViLYG8NPQw9z6q01p2gD/W8ApzSTJxdEA
BxBqPN13SbRvf8SXgAfbB2/fMMd0wgA=
=HGP6
-----END PGP PRIVATE KEY BLOCK-----`; // encrypted private key
  // const { privateKey, publicKey, revocationCertificate } = await generateKey({
  //     type: 'ecc', // Type of the key, defaults to ECC
  //     curve: 'curve25519', // ECC curve name, defaults to curve25519
  //     userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
  //     passphrase: 'super long and hard to guess secret', // protects the private key
  //     format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  // });

  // console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
  // console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
  // console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

      const passphrase = 'test'; // what the private key is encrypted with
  
      console.log('TestEncrypt readKey')
      const apublicKey = await readKey({ armoredKey: publicKey });
      console.log('TestEncrypt readKey publicKey', publicKey)
      console.log('apublicKey', apublicKey)
  
      console.log('TestEncrypt decryptKey')
      const aprivateKey = await decryptKey({
          privateKey: await readPrivateKey({ armoredKey: privateKey }),
          passphrase
      });
      console.log('aprivateKey', aprivateKey)
  
      console.log('TestEncrypt encrypt')
      const encrypted = await encrypt({
          message: await createMessage({ text: 'Hello, World!' }), // input as Message object
          encryptionKeys: apublicKey,
          signingKeys: aprivateKey // optional
      });
      console.log('TestEncrypt encrypted', encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
  
      const message = await readMessage({
          armoredMessage: encrypted // parse armored message
      });
      console.log('TestEncrypt readMessage', message)
      const { data: decrypted, signatures } = await decrypt({
          message,
          verificationKeys: apublicKey, // optional
          decryptionKeys: aprivateKey
      });
      console.log('TestEncrypt decrypt', decrypted); // 'Hello, World!'
      // check signature validity (signed messages only)
      
      await signatures[0].verified; // throws on invalid signature
      console.log('Signature is valid');

      return new Promise(() => 'WEIRD');
      
}

export async function createKeys(name: string, email: string, passphrase: string): Promise<KeyPair & { revocationCertificate: string }> {
  console.log('name email, etc', name, email, passphrase)
  // advanced types, curves, format 
  return await generateKey({
      type: 'ecc', // Type of the key, defaults to ECC
      curve: 'curve25519', // ECC curve name, defaults to curve25519
      userIDs: [{ name, email }], // you can pass multiple user IDs
      passphrase, // protects the private key
      format: 'object' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });
}

export function encryptMessage(body: string): string {

  console.log('Signature is encryptMessage');
  console.log('Signature is encryptMessage');
  const encryptedBody = body;

  return encryptedBody;
}

export function decryptMessage(encryptedBody: string): string {

  console.log('Signature is decryptMessage');
  const body = encryptedBody;

  return body;
}

export function signMessage(body: string): string {

  console.log('Signature is signMessage');
  console.log('Signature is signMessage');
  const encryptedBody = body;

  return encryptedBody;
}

// export function storeSecret(key: string): string {
  

// }

// export encryption;