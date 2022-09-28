const state = {
  visible: false,
  message: '',
};

const getters = {
};

const mutations = {
  SET_VISIBILITY(state, payload) {
    state.visible = payload;
  },
  SET_MESSAGE(state, payload) {
    state.message = payload;
  },
};

const actions = {
  show({ commit }, payload) {
    if (payload) {
      commit('SET_MESSAGE', payload);
    }
    commit('SET_VISIBILITY', true);
  },
  hide({ commit }) {
    commit('SET_MESSAGE', '');
    commit('SET_VISIBILITY', false);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
