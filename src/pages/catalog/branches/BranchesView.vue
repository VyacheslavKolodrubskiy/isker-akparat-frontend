<template>
  <APageHeader title="Просмотр “Филиала”" @back="() => $router.go(-1)">
    <template #extra>
      <QLink
        v-if="$canUse(['admin'])"
        size="large"
        :to="{ name: 'CatalogBranchesEdit', params: { id: this.$route.params.id } }"
        type="primary">
        Редактировать
      </QLink>
    </template>
  </APageHeader>
  <ACard v-if="branch">
    <ARow :gutter="[24,20]">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <LabelValue label="Наименование">
          {{ branch.title }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <LabelValue label="ГРЗ/Область">
          {{ branch.region.name }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <LabelValue label="Город">
          {{ branch.city?.name }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <LabelValue label="Адрес">
          {{ branch.address }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <LabelValue label="Телефон">
          {{ branch.phone }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <LabelValue label="E-mail">
          {{ branch.email }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="16">
        <LabelValue label="Комментарий">
          {{ branch.note }}
        </LabelValue>
      </ACol>
      <ACol :md="18" :xs="24">
        <LabelValue label="Местоположение" />
        <SelectMapPoint
          :default-city="branch.city?.name || branch.region?.name"
          :point="branch.location"
          readonly />
      </ACol>
      <ACol :xs="24">
        <LabelValue label="Активность">
          {{ $format(branch.is_active, 'yesno') }}
        </LabelValue>
      </ACol>
    </ARow>
  </ACard>
</template>

<script>

import { getAxios } from '@/services/http/request';
import SelectMapPoint from '@/components/form/SelectMapPoint.vue';

export default {
  name: 'BranchesView',
  components: { SelectMapPoint },
  data() {
    return {
      branch: null,
    };
  },
  created() {
    this.readBranch();
  },
  methods: {
    readBranch() {
      return getAxios(`branch/${this.$route.params.id}`, {}, { globalLoading: true }).then(res => {
        this.branch = res.data;
      });
    },
  },
};
</script>
