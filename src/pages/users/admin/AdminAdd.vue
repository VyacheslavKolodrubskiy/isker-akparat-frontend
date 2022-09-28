<template>
  <APageHeader
    title="Добавить пользователя “Администратор”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="admin_form" />
    </template>
  </APageHeader>

  <ACard>
    <AdminForm @submit="submit" />
  </ACard>
</template>

<script>
import { postAxios } from '@/services/http/request';
import AdminForm from '@/pages/users/admin/components/AdminForm';
import CancelButton from '@/components/buttons/CancelButton';

export default {
  name: 'UsersAdminAdd',
  components: { CancelButton, AdminForm },
  data() {
    return {};
  },
  methods: {
    submit(values) {
      postAxios('/users/admin', values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'UsersAdmin' });
      });
    },
  },
};
</script>
