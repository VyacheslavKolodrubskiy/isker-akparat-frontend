<template>
  <div>
    <APageHeader title="Организации Клиентов">
      <template #extra>
        <AddLink v-if="$canUse(['admin', 'manager'])" :to="{ name: 'CatalogOrganizationsAdd' }" />
      </template>
    </APageHeader>
    <AForm class="page-filter" layout="vertical">
      <ARow :gutter="24">
        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по наименованию">
            <AInput
              v-model:value="filterData.title"
              placeholder="Наименование организации"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по БИН/ИИН">
            <AInput
              v-model:value="filterData.bin"
              placeholder="БИН/ИИН"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по юр.адресу">
            <AInput
              v-model:value="filterData.legal_address"
              placeholder="Юр.адрес"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по email">
            <AInput
              v-model:value="filterData.email"
              placeholder="E-mail"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по телефону">
            <AInputNumber
              v-model:value="filterData.phone"
              placeholder="Телефон"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по БИК">
            <AInput
              v-model:value="filterData.bik"
              placeholder="БИК"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по ИИК">
            <AInput
              v-model:value="filterData.iik"
              placeholder="БИК"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по факт.адресу">
            <AInput
              v-model:value="filterData.fact_address"
              placeholder="Факт.адрес"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          class="page-filter__reset"
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <ResetButton @click="resetFilter" />
        </ACol>
      </ARow>
    </AForm>

    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="counterparties"
      :pagination="pagination"
      @change="changeTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          {{ $format(record.title, 'truncate', { length: 90 }) }}
        </template>
        <template v-if="column.dataIndex === 'legal_address'">
          {{ $format(record.legal_address, 'truncate', { length: 70 }) }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableActions :actions="actions" :record="record" />
        </template>
      </template>
    </QTable>
  </div>
</template>
<script>
import { getAxios } from '@/services/http/request';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';

export default {
  name: 'CatalogOrganizations',
  data() {
    return {
      filterData: {
        id: '',
        title: '',
        bin: '',
        legal_address: '',
        fact_address: '',
        iik: '',
        bik: '',
        email: '',
        phone: '',
        page: 1,
      },
      actions: [
        {
          to: (record) => ({
            name: 'CatalogOrganizationsView',
            params: { id: record.id },
          }),
          title: 'Просмотр',
        },
        {
          to: (record) => ({
            name: 'CatalogOrganizationsEdit',
            params: { id: record.id },
          }),
          title: 'Редактировать',
        },
      ],
      pagination: {},
      counterparties: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'Наименование',
          dataIndex: 'title',
          width: 300,
        },
        {
          title: 'БИН/ИИН',
          dataIndex: 'bin',
          width: 127,
        },
        {
          title: 'Юр.адрес',
          dataIndex: 'legal_address',
          width: 240,
        },
        {
          title: 'E-mail',
          dataIndex: 'email',
        },
        {
          title: 'Телефон',
          dataIndex: 'phone',
        },
        {
          dataIndex: 'action',
          width: 60,
          fixed: 'right',
        },
      ],
    };
  },
  created() {
    this.fetchOrganizations();
  },
  methods: {
    debouncedSearch: debounce(function (){
      this.submitFilter();
    }, INPUT_DELAY),

    changeTable(pagination) {
      this.filterData.page = pagination.current;
      this.submitFilter();
    },
    fetchOrganizations(params = {}) {
      getAxios('/counterparties', { ...params }).then((res) => {
        this.counterparties = res.data;
        this.pagination = res.meta;
      });
    },
    submitFilter() {
      this.fetchOrganizations(this.filterData);
    },
    resetFilter() {
      this.filterData = {
        id: '',
        title: '',
        bin: '',
        legal_address: '',
        fact_address: '',
        iik: '',
        bik: '',
        email: '',
        phone: '',
        page: 1,
      };
      this.submitFilter();
    },
  },
};
</script>
