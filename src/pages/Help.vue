
<template>
  <h1>Help with SignedMail</h1>
  <p>This app is about protecting your messages from mean people that would use your own messages against you.</p>
  <h2>Getting started</h2>
  <ol>
    <li>Create your private key and public key via Add Key.</li>
    <li>You can share your public key.</li>
    <li><strong><i>WARNING: AVOID SHARING PRIVATE KEY. THEY CAN USE YOUR PRIVATE KEY TOO!</i></strong></li>
  </ol>
  <h2>FAQ</h2>
  <h3>Why do I need to use fingerprint ID? (Mobile only)</h3>
  <p>I found that it's the most secure way to save your own secret to the phone. (Note: Most secure doesn't mean 100% secure!)</p>
  <h3>Can you support iPhones?</h3>
  <p>Apple requires using a Mac to test, sign and send app to app store. Which I don't have it presently.</p>
  <p><a href="https://cordova.apache.org/docs/en/10.x/guide/platforms/ios/ ">IOS support requires use of IOS device</a></p>
  <h3>I lost my keys</h3>
  <p>If you don't have the private key, and you don't have the revoke certificate, then there is nothing you can do about the existing key. You should:</p>
  <ol>
    <li>Generate a new pair of keys</li>
    <li>Take the time to generate a revoke certificate and make and store backups.</li>
    <li>Tell people to use the new public key instead.</li>
    <li>Gain that one step to understanding that security is hard.</li>
  </ol>
  <h3>Need more help, got feedback or questions?</h3>
  <p>Join the discussions here: <router-link :to="{name: 'discussions'}" replace>Discussions</router-link></p>
</template>
