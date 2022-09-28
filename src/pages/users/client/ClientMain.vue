<template>
  <div>
    <APageHeader title="Пользователи &quot;Клиент&quot;">
      <template #extra>
        <AddLink
          v-if="$canUse(['admin', 'manager'])"
          :to="{ name: 'UsersClientAdd' }" />
      </template>
    </APageHeader>
    <AForm class="page-filter" layout="vertical">
      <ARow
        :gutter="24">
        <ACol
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Поиск по ФИО">
            <AInput
              v-model:value="filters.name"
              placeholder="ФИО"
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
          <AFormItem label="Поиск по организации">
            <AInput
              v-model:value="filters.company"
              placeholder="Организация"
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
          <AFormItem label="Поиск по ИИН">
            <AInput
              v-model:value="filters.iin"
              placeholder="ИИН"
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
          <AFormItem label="Поиск по почте">
            <AInput
              v-model:value="filters.email"
              placeholder="Почта"
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
          <ResetButton @click="resetFilters" />
        </ACol>
      </ARow>
    </AForm>
    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="clients"
      :pagination="pagination"
      @change="changeTable">
      <template #bodyCell="{ column, record }">
        <TableActions
          v-if="column.dataIndex === 'action'"
          :actions="actions"
          :record="record" />
      </template>
    </QTable>
  </div>
</template>

<script>

import { getAxios } from '@/services/http/request';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';

export default {
  name: 'UsersClient',
  data() {
    return {
      filters: {
        name: '',
        branch: '',
        email: '',
        active: '',
        checked: 0,
        page: 1,
      },
      actions: [
        {
          to: (record) => ({
            name: 'UsersClientView',
            params: { id: record.id },
          }),
          title: 'Просмотр',
          condition: () => this.$canUse(['admin', 'manager']),
        },
        {
          to: (record) => ({
            name: 'UsersClientEdit',
            params: { id: record.id },
          }),
          title: 'Редактировать',
          condition: () => this.$canUse(['admin', 'manager']),
        },
      ],
      clients: [],
      pagination: {},
    };
  },
  computed: {
    columns() {
      return [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'ФИО',
          dataIndex: 'name',
        },
        {
          title: 'Организация',
          dataIndex: ['counterpartyUser', 'title'],
          width: 289,
        },
        {
          title: 'ИИН',
          dataIndex: 'iin',
          ellipsis: true,
        },
        {
          title: 'Почта',
          dataIndex: 'email',
        },
        {
          title: 'Телефон',
          dataIndex: 'phone',
          width: 150,
        },
        {
          dataIndex: 'action',
          width: 60,
        },
      ];
    },
  },
  created() {
    this.submitFilter();
  },
  methods: {
    debouncedSearch: debounce(function (){
      this.submitFilter();
    }, INPUT_DELAY),

    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.submitFilter();
    },
    submitFilter() {
      this.fetchClient(this.filters);
    },
    fetchClient(params = {}) {
      return getAxios('users/customer', { ...params }).then((res) => {
        this.clients = res.data;
        this.pagination = res.meta;
      });
    },
    resetFilters() {
      this.filters = {
        name: '',
        branch: '',
        email: '',
        active: '',
        checked: 0,
        page: 1,
      };
      this.submitFilter();
    },
  },
};
</script>
