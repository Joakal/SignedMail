import { KeyPair } from 'openpgp';

export interface KeysStateInterface {
  current: KeyPair | undefined;
  keys: KeyPair[]
}

function state(): KeysStateInterface {
  return {
    current: undefined,
    keys: []
  };
}

export default state;
