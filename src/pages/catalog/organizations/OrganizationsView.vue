<template>
  <APageHeader title="Просмотр “Организации клиента”" @back="() => $router.go(-1)">
    <template #extra>
      <QLink
        v-if="$canUse(['admin', 'manager', 'client'])"
        size="large"
        :to="{ name: 'CatalogOrganizationsEdit', params: { id: this.$route.params.id } }"
        type="primary">
        Редактировать
      </QLink>
    </template>
  </APageHeader>
  <ACard v-if="counterparty">
    <ARow class="mb-6" :gutter="[24, 24]">
      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Наименование">
          {{ counterparty.title }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="БИН">
          {{ counterparty.bin }}
        </LabelValue>
      </ACol>

      <ACol :md="8" :xs="0" />

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Юр.адрес">
          {{ counterparty.legal_address }}
        </LabelValue>
      </ACol>
      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Факт.адрес">
          {{ counterparty.fact_address }}
        </LabelValue>
      </ACol>

      <ACol :md="8" :xs="0" />

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="ИИК">
          {{ counterparty.iik }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="БИК">
          {{ counterparty.bik }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Банк">
          {{ counterparty.bank }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="E-mail">
          {{ counterparty.email }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="Телефон">
          {{ counterparty.phone }}
        </LabelValue>
      </ACol>

      <ACol :md="14" :xs="24">
        <LabelValue label="Комментарий">
          {{ counterparty.comment }}
        </LabelValue>
      </ACol>

      <ACol :md="10" :xs="0" />

      <!-- <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="ApiKey">
          {{ counterparty.api_key }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="ClientToken">
          {{ counterparty.client_token }}
        </LabelValue>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24">
        <LabelValue label="OMS ID">
          {{ counterparty.oms_id }}
        </LabelValue>
      </ACol> -->
    </ARow>
  </ACard>
</template>

<script>

import { getAxios } from '@/services/http/request';

export default {
  name: 'ViewProviders',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      counterparty: null,
    };
  },
  created() {
    this.readCounterparty();
  },
  methods: {
    readCounterparty() {
      return getAxios(`counterparties/${this.$route.params.id}`, {}, { globalLoading: true }).then(res => {
        this.counterparty = res.data;
      });
    },
  },
};
</script>
