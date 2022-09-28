<template>
  <APageHeader
    title="Редактировать “Организацию Клиента”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="organizations_form" />
    </template>
  </APageHeader>
  <ACard>
    <OrganizationsForm
      :data-id="$route.params.id"
      @submit="submit" />
  </ACard>
</template>
<script>
import { putAxios } from '@/services/http/request';
import OrganizationsForm from '@/pages/catalog/organizations/components/OrganizationsForm';

export default {
  name: 'AddProvider',
  components: { OrganizationsForm },
  data() {
    return {
    };
  },

  methods: {
    submit(values) {
      putAxios(`/counterparties/${this.$route.params.id}`, { ...values }, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'CatalogOrganizations' });
      });
    },
  },
};
</script>
