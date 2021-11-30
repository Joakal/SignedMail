import { RouteRecordRaw } from 'vue-router';

// const checkKey = ( next: NavigationGuardNext) => {

//   if (1 === 1) {
//     console.log('checkKey next');
//     next();
//   } else{
//     console.log('checkKey else');

//   }
//   // router.push({ 
//   //   name: 'login',
//   //   params: {
//   //     returnTo: to.path,
//   //     query: to.query,
//   //   },
//   // });
//     // function checking(): void {
//     //   // 'error' will be an object with an error code and message
//     //   something.value = 'checking'
//     //   // Fingerprint.isAvailable(isAvailableSuccess, isAvailableError, {allowBackup: true});
//     //   Fingerprint.show({
//     //   clientId: 'Fingerprint-Demo',
//     //   clientSecret: 'password', //Only necessary for Android
//     //   description: 'Some biometric description', disableBackup: false, allowBackup: true
//     // }, successCallback, errorCallback)
//     //   // Fingerprint.loadBiometricSecret({
//     //   //     description: 'Some biometric description',
//     //   //     disableBackup: true, // always disabled on Android
//     //   //   }, successCallback, errorCallback);

//     // }
// }

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'encrypt', path: '', component: () => import('src/pages/Encrypt.vue')},
      { name: 'decrypt', path: 'decrypt', component: () => import('src/pages/Decrypt.vue')},
      // { name: 'signing', path: 'signing', component: () => import('src/pages/Signing.vue')},
      { name: 'public', path: 'public', component: () => import('src/pages/PublicKeys.vue') },
      { name: 'private', path: 'private', component: () => import('src/pages/PrivateKeys.vue') },
      { name: 'add', path: 'add', component: () => import('src/pages/AddingKeys.vue') },
      { name: 'help', path: 'help', component: () => import('src/pages/Help.vue') },
      { name: 'about', path: 'about', component: () => import('src/pages/About.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
