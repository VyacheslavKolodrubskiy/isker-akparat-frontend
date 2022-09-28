<template>
  <APageHeader
    title="Добавить пользователя “Менеджер”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="manager_form" />
    </template>
  </APageHeader>

  <ACard>
    <ManagerForm @submit="submit" />
  </ACard>
</template>

<script>
import { postAxios } from '@/services/http/request';
import ManagerForm from '@/pages/users/manager/components/ManagerForm';
import CancelButton from '@/components/buttons/CancelButton';

export default {
  name: 'UsersManagerAdd',
  components: { CancelButton, ManagerForm },
  data() {
    return {};
  },
  methods: {
    submit(values) {
      postAxios('/users/manager', values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'UsersManager' });
      });
    },
  },
};
</script>
