<template>
  <APageHeader
    title="Редактировать “Заказ на формирование КМ”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="order_form" />
    </template>
  </APageHeader>

  <ACard>
    <OrderForm
      :data-id="$route.params.id"
      @submit="submit" />
  </ACard>
</template>

<script>
import { putAxios } from '@/services/http/request';
import OrderForm from '@/pages/suz/orders/components/OrderForm';

export default {
  name: 'OrderEdit',
  components: { OrderForm },
  data() {
    return {
    };
  },
  methods: {
    submit(values) {
      putAxios(`/orders/${this.$route.params.id}`, { ...values }, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'Order' });
      });
    },
  },
};
</script>
