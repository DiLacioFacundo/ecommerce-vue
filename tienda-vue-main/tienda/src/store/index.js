import Vue from 'vue';
import Vuex from 'vuex';
import * as jwtDecode from "jwt-decode";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user_data')) || null,
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    currentUser: (state) => state.user,
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
      localStorage.setItem('user_data', JSON.stringify(user));
    },
    logout({ commit }) {
      commit('clearAuth');
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
    },
    decodeAndSaveToken({ commit }, token) {
      try {
        const decodedToken = jwtDecode(token);
        commit('setToken', token);
        commit('setUser', decodedToken);
        localStorage.setItem('token', token);
        localStorage.setItem('user_data', JSON.stringify(decodedToken));
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    },
    initializeAuth({ commit }) {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user_data'));

      if (token) {
        commit('setToken', token);
      }
      if (user) {
        commit('setUser', user);
      }
    },
  },
});
