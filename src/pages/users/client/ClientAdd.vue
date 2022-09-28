<template>
  <APageHeader
    title="Добавить пользователя “Клиент”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="client_form" />
    </template>
  </APageHeader>

  <ACard>
    <ClientForm @submit="submit" />
  </ACard>
</template>

<script>
import { postAxios } from '@/services/http/request';
import ClientForm from '@/pages/users/client/components/ClientForm';
import CancelButton from '@/components/buttons/CancelButton';

export default {
  name: 'UsersClientAdd',
  components: { CancelButton, ClientForm },
  data() {
    return {};
  },
  methods: {
    submit(values) {
      postAxios('/users/customer', values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'UsersClient' });
      });
    },
  },
};
</script>
