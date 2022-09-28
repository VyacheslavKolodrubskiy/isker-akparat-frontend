<template>
  <div class="providers">
    <APageHeader title="Филиалы">
      <template #extra>
        <AddLink v-if="$canUse('admin')" :to="{ name: 'CatalogBranchesAdd' }" />
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
              v-model:value="filters.title"
              placeholder="Наименование"
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
          <AFormItem label="Поиск по адресу">
            <AInput
              v-model:value="filters.address"
              placeholder="Адрес"
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
          <AFormItem label="Поиск по E-mail">
            <AInput
              v-model:value="filters.email"
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
            <AInput
              v-model:value="filters.phone"
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
          <AFormItem label="Активен">
            <ARadioGroup v-model:value="filters.is_active" @change="debouncedSearch">
              <ARadio :value="1">
                Да
              </ARadio>
              <ARadio :value="0">
                Нет
              </ARadio>
            </ARadioGroup>
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
      v-if="branches"
      :actions="actions"
      :columns="columns"
      :data-source="branches"
      :pagination="pagination"
      @change="changeTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'is_active'">
          {{ $format(record.is_active, 'yesno') }}
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
  name: 'CatalogBranches',
  data() {
    return {
      filters: {
        title: '',
        address: '',
        email: '',
        phone: '',
        is_active: null,
        page: 1,
      },
      actions: [
        {
          to: (record) => (
            {
              name: 'CatalogBranchesView',
              params: { id: record.id },
            }),
          title: 'Просмотр',
        },
        {
          to: (record) => (
            {
              name: 'CatalogBranchesEdit',
              params: { id: record.id },
            }),
          title: 'Редактировать',
          condition: () => this.$canUse(['admin']),
        },
      ],
      branches: [],
      pagination: {},
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'Наименование',
          dataIndex: 'title',
        },
        {
          title: 'ГРЗ/Область',
          dataIndex: ['region', 'name'],
        },
        {
          title: 'Город',
          dataIndex: ['city', 'name'],
          width: 150,
        },
        {
          title: 'E-mail',
          dataIndex: 'email',
        },
        {
          title: 'Телефон',
          dataIndex: 'phone',
          width: 120,
        },
        {
          title: 'Активность',
          dataIndex: 'is_active',
        },
        {
          dataIndex: 'action',
          fixed: 'right',
          width: 60,
        },
      ],
    };
  },
  created() {
    this.fetchBranches();
  },
  methods: {
    debouncedSearch: debounce(function (){
      this.submitFilter();
    }, INPUT_DELAY),

    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.submitFilter();
    },

    fetchBranches(params = {}) {
      getAxios('/branch', { ...params }).then((res) => {
        this.branches = res.data;
        this.pagination = res.meta;
      });
    },

    submitFilter() {
      this.fetchBranches(this.filters);
    },

    resetFilter() {
      this.filters = {
        title: '',
        address: '',
        email: '',
        phone: '',
        is_active: null,
        page: 1,
      };
      this.submitFilter();
    },
  },
};
</script>
