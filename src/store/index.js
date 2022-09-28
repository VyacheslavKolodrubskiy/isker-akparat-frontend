import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

// new
import globalOverlay from '@/store/modules/global-overlay.store';
import globalSpinner from '@/store/modules/global-spinner.store';
import user from '@/store/modules/user.store';
import auth from '@/store/modules/auth.store';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    user,
    auth,
    globalOverlay,
    globalSpinner,
  },
  plugins: [createPersistedState({
    paths: ['auth'],
  })],
});
