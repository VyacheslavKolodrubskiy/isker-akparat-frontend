<template>
  <APageHeader title="Добавить “Филиал”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="branches_form" />
    </template>
  </APageHeader>
  <ACard>
    <BranchesForm @submit="submit" />
  </ACard>
</template>
<script>
import { postAxios } from '@/services/http/request';
import BranchesForm from '@/pages/catalog/branches/components/BranchesForm.vue';

export default {
  name: 'CatalogBranchesAdd',
  components: {
    BranchesForm,
  },
  data() {
    return {};
  },
  methods: {
    submit(values) {
      postAxios('/branch/', values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Успешно обновлен',
        });
        this.$router.push({ name: 'CatalogBranches' });
      });
    },
  },
};
</script>
