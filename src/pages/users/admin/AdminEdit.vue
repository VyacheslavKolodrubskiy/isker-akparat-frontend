<template>
  <APageHeader
    title="Редактировать пользователя “Администратор”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="admin_form" />
    </template>
  </APageHeader>

  <ACard>
    <AdminForm
      :data-id="$route.params.id"
      @submit="submit" />
  </ACard>
</template>

<script>
import { putAxios } from '@/services/http/request';
import AdminForm from '@/pages/users/admin/components/AdminForm';

export default {
  name: 'UsersAdminEdit',
  components: {
    AdminForm,
  },
  data() {
    return {
    };
  },
  methods: {
    submit(values) {
      putAxios(`/users/admin/${this.$route.params.id}`, values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Успешно обновлен',
        });
        this.$router.push({ name: 'UsersAdmin' });
      });
    },
  },
};
</script>
