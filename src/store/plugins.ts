import { Plugin } from 'vuex';
import { StateInterface } from '.';
import { KeysStateInterface } from './keys/state';

export const STORAGE_KEY = 'signedmail'

const localStoragePlugin: Plugin<StateInterface> = store => {
  store.subscribe(({type}, {keys}) => {
    // Lets not overwrite our local store with empty values
    if (type !== 'initialiseStore') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    }
  })
}

export const localStorageStore = () => {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') as KeysStateInterface
}

export default [localStoragePlugin]