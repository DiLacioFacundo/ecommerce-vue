import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); // Register Vuex plugin

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user_data') || null,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
    },
  },
  actions: {
    saveToken({ commit }, token) {
      commit('setToken', token);
      localStorage.setItem('token', token);
    },
    saveUser({ commit }, user) {
      commit('setUser', user);
      localStorage.setItem('user_data', user);
    },
    logout({ commit }) {
      commit('clearAuth');
      localStorage.clear();
    },
  },
  modules: {
    // Add Vuex modules here if needed
  },
});
