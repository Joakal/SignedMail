import { RouteRecordRaw } from 'vue-router';

const externalRoute = ({name, path}: {name: string, path: string}) => ({ path: `/redirect?url=${encodeURIComponent(path)}`, name, redirect: () => {location.href = path; return ''}})

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('src/pages/Splash.vue')},
      { name: 'chats', path: 'chats/:myPrivateKeyID', component: () => import('src/pages/Chats.vue')},
      { name: 'chat', path: 'chats/:myPrivateKeyID/:theirPublicKeyID', component: () => import('src/pages/Chat.vue')},

      { name: 'encrypt', path: '/encrypt', component: () => import('src/pages/Encrypt.vue')},
      { name: 'decrypt', path: 'decrypt', component: () => import('src/pages/Decrypt.vue')},
      { name: 'signing', path: 'signing', component: () => import('src/pages/Signing.vue')},
      { name: 'verifying', path: 'verifying', component: () => import('src/pages/Verifying.vue')},
      { name: 'public', path: 'public', component: () => import('src/pages/PublicKeys.vue') },
      { name: 'private', path: 'private', component: () => import('src/pages/PrivateKeys.vue') },
      { name: 'create', path: 'create', component: () => import('src/pages/CreateKeys.vue')},

      { name: 'add', path: 'add', component: () => import('src/pages/AddingKeys.vue') },

      { name: 'key', path: 'key/:keyID', component: () => import('src/pages/KeyDetail.vue') },

      { name: 'help', path: 'help', component: () => import('src/pages/Help.vue') },
      { name: 'about', path: 'about', component: () => import('src/pages/About.vue') },
      
      { name: 'privacy', path: 'privacy', component: () => import('src/pages/PrivacyPolicy.vue') }
    ],
  },

  // External, for reuse
  externalRoute({name: 'project-page', path: 'https://github.com/Joakal/SignedMail'}),
  externalRoute({name: 'discussions', path: 'https://github.com/Joakal/SignedMail/discussions'}),
  externalRoute({name: 'contact-us', path: 'https://github.com/Joakal/SignedMail/discussions'}),

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
