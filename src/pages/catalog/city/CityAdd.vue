<template>
  <div>
    <APageHeader title="Добавить “Город”" @back="() => $router.go(-1)">
      <template #extra>
        <CancelButton />
        <SubmitButton form="city_form" />
      </template>
    </APageHeader>
    <ACard>
      <CityForm @submit="submit" />
    </ACard>
  </div>
</template>
<script>
import { postAxios } from '@/services/http/request';
import CityForm from '@/pages/catalog/city/components/CityForm';

export default {
  name: 'CatalogCityAdd',
  components: {
    CityForm,
  },
  data() {
    return {};
  },
  methods: {
    submit(values) {
      postAxios('/cities/', values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.$router.push({ name: 'CatalogCity' });
      });
    },
  },
};
</script>
