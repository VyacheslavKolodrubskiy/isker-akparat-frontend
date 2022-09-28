<script>
import { h } from 'vue';
import { DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';

export default {
  created() {
    this.$store.dispatch('auth/logout');
    this.$router.push({ name: DEFAULT_LOGGED_OUT_ROUTE_NAME });
  },
  render() {
    return h('div'); // avoid warning message
  },
};
</script>
