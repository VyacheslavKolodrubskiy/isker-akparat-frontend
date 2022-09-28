import router from '@/router';
import { nextTick } from 'vue';
import { DEFAULT_TITLE } from '@/config/constants';

router.afterEach((to, from) => {
  nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});