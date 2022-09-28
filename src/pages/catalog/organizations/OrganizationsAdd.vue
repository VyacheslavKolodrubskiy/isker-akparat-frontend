<template>
  <APageHeader
    title="Добавить “Организацию Клиента”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="organizations_form" />
    </template>
  </APageHeader>
  <ACard>
    <OrganizationsForm @submit="submit" />
  </ACard>
</template>
<script>
import { postAxios } from '@/services/http/request';
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
      postAxios('/counterparties/', values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'CatalogOrganizations' });
      });
    },
  },
};
</script>
