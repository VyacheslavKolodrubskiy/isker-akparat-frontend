<template>
  <APageHeader
    title="Редактировать пользователя “Менеджер”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="manager_form" />
    </template>
  </APageHeader>

  <ACard>
    <ManagerForm
      :data-id="$route.params.id"
      @submit="submit" />
  </ACard>
</template>

<script>
import { putAxios } from '@/services/http/request';
import ManagerForm from '@/pages/users/manager/components/ManagerForm';

export default {
  name: 'UsersManagerEdit',
  components: {
    ManagerForm,
  },
  data() {
    return {
    };
  },
  methods: {
    submit(values) {
      putAxios(`/users/manager/${this.$route.params.id}`, values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Успешно обновлен',
        });
        this.$router.push({ name: 'UsersManager' });
      });
    },
  },
};
</script>
