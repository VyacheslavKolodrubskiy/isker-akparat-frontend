<template>
  <APageHeader
    title="Добавить “Заказ на формирование КМ”"
    @back="() => $router.go(-1)">
    <template #extra>
      <CancelButton />
      <SubmitButton form="order_form" />
    </template>
  </APageHeader>

  <ACard>
    <OrderForm @submit="submit" />
  </ACard>
</template>
3
<script>
import { postAxios } from '@/services/http/request';
import OrderForm from '@/pages/suz/orders/components/OrderForm';

export default {
  name: 'OrderAdd',
  components: { OrderForm },

  data() {
    return {};
  },

  methods: {
    submit(values) {
      postAxios('/orders', values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'Order' });
      });
    },
  },
};
</script>
