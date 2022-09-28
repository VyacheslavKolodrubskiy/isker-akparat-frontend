const state = {
  loading: 0,
};

const mutations = {
  START_LOADING(state) {
    state.loading++;
  },
  STOP_LOADING(state) {
    if (state.loading > 0) {
      state.loading--;
    }
  },
};

const actions = {
  start({ commit }) {
    commit('START_LOADING');
  },
  stop({ commit }) {
    commit('STOP_LOADING');
  },
};

const getters = {
  isLoading: (state) => state.loading > 0,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
