<template>
  <APageHeader
    title="Просмотр пользователя “Менеджер”"
    @back="() => $router.go(-1)">
    <template #extra>
      <QLink
        v-if="$canUse('admin')"
        size="large"
        :to="{
          name: 'UsersManagerEdit',
          params: { id: this.$route.params.id },
        }"
        type="primary">
        Редактировать
      </QLink>
    </template>
  </APageHeader>

  <ACard v-if="manager">
    <ARow :gutter="[24, 24]">
      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="ФИО">
          {{ manager.name }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Почта">
          {{ manager.email }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Телефон">
          {{ manager.phone }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Филиал">
          {{ manager.branchUser?.title }}
        </LabelValue>
      </ACol>

      <ACol
        :md="16"
        :xs="24">
        <LabelValue label="Комментарий">
          {{ manager.note }}
        </LabelValue>
      </ACol>

      <ACol
        :xs="24">
        <LabelValue label="Активность">
          {{ getStatus }}
        </LabelValue>
      </ACol>
    </ARow>
  </ACard>
</template>

<script>

import { getAxios } from '@/services/http/request';

export default {
  name: 'UsersManagerView',
  data() {
    return {
      manager: null,
    };
  },
  computed: {
    getStatus() {
      return this.$format(this.manager.is_active, 'yesno');
    },
  },
  created() {
    this.readManager();
  },
  methods: {
    readManager() {
      getAxios(`users/manager/${this.$route.params.id}`, {}, { globalLoading: true }).then((res) => {
        this.manager = res.data;
      });
    },
  },
};
</script>
