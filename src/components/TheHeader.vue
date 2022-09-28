<template>
  <ALayoutHeader class="header">
    <TheBreadcrumbs />
    <ADropdown :trigger="['click']">
      <a
        class="text-body text-truncate"
        style="max-width: 200px"
        @click.prevent>
        <AAvatar class="mr-2" size="large">
          <template #icon><QIcon type="user" /></template>
        </AAvatar>
        <span>{{ currentUser?.name }}</span>
      </a>

      <template #overlay>
        <AMenu>
          <AMenuItem>
            <RouterLink
              :to="{ name: 'Profile' }">
              Профиль
            </RouterLink>
          </AMenuItem>
          <AMenuItem class="logout" @click="logout">
            Выйти
          </AMenuItem>
        </AMenu>
      </template>
    </ADropdown>
  </ALayoutHeader>
</template>

<script>
import { mapGetters } from 'vuex';
import { DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue';

export default {
  name: 'TheHeader',
  components: {
    TheBreadcrumbs,
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/current',
    }),
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push({ name: DEFAULT_LOGGED_OUT_ROUTE_NAME });
    },
  },
};
</script>
