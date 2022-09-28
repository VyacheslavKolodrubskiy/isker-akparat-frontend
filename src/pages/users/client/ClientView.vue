<template>
  <APageHeader
    title="Просмотр пользователя “Клиент”"
    @back="() => $router.go(-1)">
    <template #extra>
      <QLink
        v-if="$canUse('admin')"
        size="large"
        :to="{
          name: 'UsersClientEdit',
          params: { id: this.$route.params.id },
        }"
        type="primary">
        Редактировать
      </QLink>
    </template>
  </APageHeader>
  <ACard v-if="client">
    <ARow :gutter="[24, 24]">
      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="ФИО">
          {{ client.name }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="ИИН">
          {{ client.iin }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Организация">
          {{ client.counterpartyUser?.title }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Почта">
          {{ client.email }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Телефон">
          {{ client.phone }}
        </LabelValue>
      </ACol>

      <ACol
        :xs="24">
        <LabelValue label="Комментарий">
          {{ client.note }}
        </LabelValue>
      </ACol>
    </ARow>
  </ACard>
</template>

<script>
import { getAxios } from '@/services/http/request';

export default {
  name: 'UsersClientView',
  data() {
    return {
      client: null,
    };
  },
  created() {
    this.readClient();
  },
  methods: {
    readClient() {
      getAxios(`users/customer/${this.$route.params.id}`, {}, { globalLoading: true }).then((res) => {
        this.client = res.data;
      });
    },
  },
};
</script>
