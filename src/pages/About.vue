
<template>
  <h1>About SignedMail</h1>
  <p>This application is designed to be:</p>
  <ul>
    <li>Simple</li>
    <li>Reproducible</li>
    <li>Secure</li>
    <li>Offline</li>
  </ul>
  <h2>Powered by</h2>
  <ul>
    <li>PGP</li>
    <li>Vue</li>
    <li>Quasar</li>
  </ul>
  <h2>Under the hood</h2>
  <ul>
    <li><a href="https://www.uperesia.com/pgp-explained">PGP explained</a></li>
    <li><a href="https://users.ece.cmu.edu/~adrian/630-f04/PGP-intro.html">How PGP works </a></li>
    <li><a href="https://www.comparitech.com/blog/information-security/pgp-encryption/">What is PGP encryption and how does it work?</a></li>
    <li><a href="https://hal.archives-ouvertes.fr/hal-01397035/document">How to Explain Modern Security Concepts to your Children</a></li>
    <li><a href="https://en.wikipedia.org/wiki/Pretty_Good_Privacy">Wikipedia: Pretty Good Privacy</a></li>
    <li><a href="https://www.openpgp.org/">OpenPGP</a></li>
  </ul>
  <h3>The codes</h3>
  <p>You are most welcome to run this application yourself. Please follow the instructions in the README.md on <router-link :to="{name: 'project-page'}" replace>SignedMail</router-link></p>
  <p>For help understanding Quasar/Vue/application development, please see: <a href="https://quasar.dev/video-tutorials">https://quasar.dev/video-tutorials</a></p>
  <p>It's encouraged to try to implement projects with PGP as the more people that welcome it, the less likely that the government will favour disclosure over encryption.</p>
  <h3>Need more help, got feedback or questions?</h3>
  <p>Join the discussions here: <router-link :to="{name: 'discussions'}" replace>Discussions</router-link></p>
  <h2>About us</h2>
  <p>A developer, Andreas (Joakal) Markauskas. I wanted this tool because it's creepy how some companies are monitoring my messages and I'm seeing inappropriate ads and my feed had been curated based on what I say or see from others. Every year, they are getting more efficient with tracking, sending inappropriate content and why not? My messages to them are very valuable. What can I do to stop them? I can quit those platforms but I will lose family and friends. Will they pass on the profits from my data? Haha, nope.</p>
  <h3>Contact us</h3>
  <p><router-link :to="{name: 'contact-us'}" replace>Please contact us through here</router-link></p>
  <h3>Security</h3>
  <p>For security issues, please encrypt your messages with the below public key that belongs to me. To confirm my public key, I am also Joakal on Reddit and Andreas Markauskas on Linkedin</p>
  <show-key :keyValue="publicKey" label="Public Key" download copy keyDetail />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from 'vue';

export default defineComponent({
  name: 'Chats',
  components: { ShowKey: defineAsyncComponent(() => import('components/ShowKey.vue')), },
  setup() {
    return {
      publicKey: ref(`-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEYfT7qBYJKwYBBAHaRw8BAQdAqZwp9VNT/3t4ojtF5cNWdDkMwpnlR7zG
6/bzIly/gobNK0FuZHJlYXMgTWFya2F1c2thcyA8YW1hcmthdXNrYXMxQGdt
YWlsLmNvbT7CjAQQFgoAHQUCYfT7qAQLCQcIAxUICgQWAAIBAhkBAhsDAh4B
ACEJEMyopmGFtugFFiEEuB2ZLEVqEGN8F8VIzKimYYW26AXxQgEA4aiaOpCm
+kJa07VyAXE/6KU1KnCgens4Xe/r5RTRoKEBAKfhIj0jmmCf98X/18scCVvV
Z6G35JLgZZt5wAt3O+ICzjgEYfT7qBIKKwYBBAGXVQEFAQEHQHVf2SBBxMV9
mwxbwrO3EBkn7U4sZCrjrQRwisBdy7kIAwEIB8J4BBgWCAAJBQJh9PuoAhsM
ACEJEMyopmGFtugFFiEEuB2ZLEVqEGN8F8VIzKimYYW26AWcMwEA4S/a4tQL
bfVGPWp0o2DkJm6jSRUHUU7PbOv1GZaojqIA/ischMRtccv25EdooQCYteAF
M26KE+BIuwy63uXqQYUB
=aFT/
-----END PGP PUBLIC KEY BLOCK-----`)
    }
  }
})
</script>
