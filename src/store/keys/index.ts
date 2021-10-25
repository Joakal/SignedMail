import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { KeysStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const keysModule: Module<KeysStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default keysModule;
