<template>
  <ErrorPage status="403" title="У вас нет доступа к этой странице">
    Вернитесь на <RouterLink :to="path">
      главную страницу
    </RouterLink>
  </ErrorPage>
</template>

<script>
import ErrorPage from '@/pages/errors/components/ErrorPage.vue';
import { DEFAULT_LOGGED_IN_ROUTE_NAME } from '@/config/constants';

export default {
  components: { ErrorPage },
  name: 'Error403',
  computed: {
    path() {
      return { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
    },
  },

};
</script>
