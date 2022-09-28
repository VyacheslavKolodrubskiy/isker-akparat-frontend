
import { getAxios } from '@/services/http/request';
import { checkPermission } from '@/utils/permissions';
import store from '@/store';
import router from '@/router';
import { DEFAULT_LOGGED_IN_ROUTE_NAME, DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';

function getCurrentUser() {
  if (!!store.getters['user/current']) return Promise.resolve();

  return getAxios('/profile')
    .then(res => {
      store.dispatch('user/setCurrentUser', { user: res.data });
      return res;
    });
}

// Не удаляйте логи, они нужны для дебага роутинга!
router.beforeEach((to, from) => {
  // console.log(`%cGoing to %c${to.name}`, 'font-weight: bold', 'font-weight: bold; color: blue', to);

  if (['Error500', 'logout'].includes(to.name)) return;

  if (store.getters['auth/isLoggedIn']) {
    // console.log('user logged in');

    if (to.meta.onlyLoggedOut) {
      // console.log('this page only for logged out');
      return { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
    }

    return getCurrentUser()
      .then(() => {
        if (!checkPermission(to.meta.permissions) && !to.meta.public) {
          // console.log('access denied');
          return { name: 'Error403' };
        }

        // console.log('access granted');
      });
  }

  // console.log('user is logged out');
  if (!to.meta.public && !to.meta.onlyLoggedOut) {
    // console.log('access denied');
    return { name: DEFAULT_LOGGED_OUT_ROUTE_NAME };
  }
  // console.log('access granted');
});
