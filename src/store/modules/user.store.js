const state = {
  current: null,
};

const mutations = {
  SET_USER(state, payload) {
    state.current = payload;
  },
};

const actions = {
  setCurrentUser({ commit }, { user }) {
    commit('SET_USER', user);
  },
};

const getters = {
  current: (state) => state.current,
  userRole: (state, getters) => state.current ? getters.current.role : {},
};

export default {
  state, mutations, actions, getters, namespaced: true,
};
