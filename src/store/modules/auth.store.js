import { postAxios } from '@/services/http/request';

const state = {
  token: null,
};

const mutations = {
  LOGIN(state, token) {
    state.token = token;
  },

  LOGOUT(state) {
    state.token = null;
  },
};

const actions = {
  login({ commit, dispatch }, data) {
    return postAxios('/auth/login', data)
      .then((res) => {
        const { token } = res.data;
        commit('LOGIN', token);
        return res;
      });
  },
  logout({ commit }) {
    commit('LOGOUT');
    commit('user/SET_USER', null, { root: true });
  },
};

const getters = {
  isLoggedIn: (state) => !!state.token,
};

export default {
  state, mutations, actions, getters, namespaced: true,
};
