import { debounce } from '@/utils/lodash';
import { reactive, computed } from 'vue';
import { MOBILE_BREAKPOINT } from '@/config/constants';

const RESIZE_DELAY = 100;

export const app = reactive({
  width: window.innerWidth,
});

export const isMobile = computed(() => app.width < MOBILE_BREAKPOINT);

const debouncedResizeHandler = debounce(() => {
  app.width = window.innerWidth;
}, RESIZE_DELAY);

window.addEventListener('resize', debouncedResizeHandler);

export default function install(app) {
  Object.defineProperties(app.config.globalProperties, {
    $isMobile: {
      get() {
        return isMobile.value;
      },
    },
  });
}
