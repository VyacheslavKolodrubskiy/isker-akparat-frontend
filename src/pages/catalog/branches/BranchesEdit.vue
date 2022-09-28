<template>
  <APageHeader title="Редактировать “Филиал”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="branches_form" />
    </template>
  </APageHeader>
  <ACard>
    <BranchesForm
      :data-id="$route.params.id"
      @submit="submit" />
  </ACard>
</template>
<script>
import { putAxios } from '@/services/http/request';
import BranchesForm from '@/pages/catalog/branches/components/BranchesForm.vue';

export default {
  name: 'CatalogBranchesEdit',
  components: {
    BranchesForm,
  },
  data() {
    return {
    };
  },
  methods: {
    submit(values) {
      putAxios(`/branch/${this.$route.params.id}`, { id: this.$route.params.id, ...values }, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Успешно обновлен',
        });
        this.$router.push({ name: 'CatalogBranches' });
      });
    },
  },
};
</script>
