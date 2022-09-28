<template>
  <APageHeader title="Редактировать “Печать КМ”" @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="print_form" />
    </template>
  </APageHeader>

  <ACard>
    <PrintForm
      :data-id="$route.params.id"
      @restricted="handleRestricted"
      @submit="submit" />
  </ACard>
</template>
<script>
import { putAxios } from '@/services/http/request';
import PrintForm from '@/pages/suz/print/components/PrintForm';

export default {
  name: 'PrintAdd',
  components: { PrintForm },
  data() {
    return {
    };
  },
  methods: {
    handleRestricted() {
      this.$router.replace({ name: 'Print' });
    },
    submit(values) {
      putAxios(`print-groups/${this.$route.params.id}`, values, { globalLoading: true }).then(res => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'Print' });
      });
    },
  },
};
</script>
