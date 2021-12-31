
<template>
  <h3>Help with SignedMail</h3>
  <p>This app is about protecting your messages from mean people that would use your own messages against you.</p>
  <p>Warning: This is not 100% protection.</p>
  <h3>Getting started</h3>
  <ol>
    <li>Create your private key in Keys. Keep it to yourself! <strong><i>NEVER SHARE OR ASK SOMEONE TO TAKE CARE OF IT!</i></strong></li>
    <li>You can share your public key. More on this below.</li>
  </ol>
  <h3>FAQ (or maybe someone will ask)</h3>
  <h4>Why do I need to use fingerprint ID?</h4>
  <p>I found that it's the most secure way to save your own secret to the phone. (Note: Most secure doesn't mean 100% secure!)</p>
  <h4>Can you support iPhones?</h4>
  <p>Apple requires using a Mac to test, sign and send app to app store. Which I don't have it presently.</p>
  <p><a href="https://cordova.apache.org/docs/en/10.x/guide/platforms/ios/ ">IOS support requires use of IOS device</a></p>
  <h4>I lost my keys</h4>
  <p>If you don't have the private key, and you don't have the revoke certificate, then there is nothing you can do about the existing key. You should:</p>
  <ol>
    <li>Generate a new pair of keys</li>
    <li>Take the time to generate a revoke certificate and make and store backups.</li>
    <li>Tell people to use the new public key instead.</li>
    <li>Gain that one step to understanding that security is hard.</li>
  </ol>
</template>
