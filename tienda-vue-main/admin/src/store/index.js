import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    resetUserState(state) {
      state.token = null;
      localStorage.removeItem('token'); 
    },
  },
  actions: {
    saveToken({ commit }, token) {
      commit('setToken', token);
      localStorage.setItem('token', token);
    },
    resetUserState({ commit }) {
      commit('resetUserState');
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
  },
});

