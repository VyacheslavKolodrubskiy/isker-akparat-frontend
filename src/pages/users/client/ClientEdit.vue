<template>
  <APageHeader
    title="Редактировать пользователя “Клиент”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="client_form" />
    </template>
  </APageHeader>

  <ACard>
    <ClientForm
      :data-id="$route.params.id"
      @submit="submit" />
  </ACard>
</template>

<script>
import { putAxios } from '@/services/http/request';
import ClientForm from '@/pages/users/client/components/ClientForm';

export default {
  name: 'UsersClientEdit',
  components: {
    ClientForm,
  },
  data() {
    return {
    };
  },
  methods: {
    submit(values) {
      putAxios(`/users/customer/${this.$route.params.id}`, values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Успешно обновлен',
        });
        this.$router.push({ name: 'UsersClient' });
      });
    },
  },
};
</script>
