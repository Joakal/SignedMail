
<template>
  <h1>Help with SignedMail</h1>

  <div>
    Pros / Cons

    Messaging company won't see your messages / No history

    Warning: This is not 100% protection.

    

    Getting started

    1. Create your private key in Keys. Keep it to yourself! NEVER SHARE IT!
    2. You can share your public key. More on this below.

    Encryption

    1. Write "Hello, I am at area 54"
    2. Click Encrypt
    3. Click copy
    4. Send it

    Decryption

    1. Paste the encrypted message
    2. Click Decrypt

    FAQ (or maybe someone will ask)

    Why do I need to use fingerprint ID? 

    I found that it's the most secure way to save your own secret to the phone. (Note: Most secure doesn't mean 100% secure!)

    Why do you not support iPhones? 

    LINK: https://cordova.apache.org/docs/en/10.x/guide/platforms/ios/ Apple requires using a Mac to test, sign and send app to app store. So, I don't have it presently.

    If you don't have the private key, and you don't have the revoke certificate, then there is nothing you can do about the existing key.

    You should:

        Generate a new pair of keys
        Take the time to generate a revoke certificate and make and store backups.
        Publish your new public key to a key server
        Let anyone who uses the old key know you have a new one

  </div>

</template>

<script>
export default {

}
</script>

<style>

</style>