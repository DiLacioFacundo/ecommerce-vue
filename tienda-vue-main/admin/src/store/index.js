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
  },
  actions: {
    saveToken({ commit }, token) {
      commit('setToken', token);
      localStorage.setItem('token', token);
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
  },
});
