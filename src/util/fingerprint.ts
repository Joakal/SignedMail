/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import Fingerprint from 'app/src-cordova/plugins/cordova-plugin-fingerprint-aio/www/Fingerprint';

function isAvailableSuccess() {
  return true
}

function isAvailableError() {
  return false;
}

export function authorised(): boolean {
  // If Android
  if (1 === 1) {
    Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
    return true
  } else {
    return true;
  }
}