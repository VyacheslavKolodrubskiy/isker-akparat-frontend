<template>
  <div>
    <APageHeader title="Пользователи &quot;Менеджер&quot;">
      <template #extra>
        <AddLink
          v-if="$canUse(['admin'])"
          :to="{ name: 'UsersManagerAdd' }" />
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
          <AFormItem label="Поиск по филиалу">
            <AInput
              v-model:value="filters.branch"
              placeholder="Филиал"
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
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          :xxl="4">
          <AFormItem label="Активен">
            <ARadioGroup v-model:value="filters.status" @change="debouncedSearch">
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
          <ResetButton @click="resetFilters" />
        </ACol>
      </ARow>
    </AForm>
    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="managers"
      :pagination="pagination"
      @change="changeTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'is_active'">
          {{ $format(record.is_active, 'yesno') }}
        </template>
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
  name: 'UsersManager',

  data() {
    return {
      filters: {
        name: '',
        branch: '',
        email: '',
        active: '',
        status: null,
        page: 1,
      },
      actions: [
        {
          to: (record) => ({
            name: 'UsersManagerView',
            params: { id: record.id },
          }),
          title: 'Просмотр',
          condition: () => this.$canUse(['admin', 'manager']),
        },
        {
          to: (record) => ({
            name: 'UsersManagerEdit',
            params: { id: record.id },
          }),
          title: 'Редактировать',
          condition: () => this.$canUse(['admin']),
        },
      ],
      managers: [],
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
          title: 'Филиал',
          dataIndex: ['branchUser', 'title'],
          width: 289,
        },
        {
          title: 'Почта',
          dataIndex: 'email',
          ellipsis: true,
        },
        {
          title: 'Телефон',
          dataIndex: 'phone',
        },
        {
          title: 'Активность',
          dataIndex: 'is_active',
          width: 120,
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
      this.fetchManagers(this.filters);
    },

    fetchManagers(params = {}) {
      return getAxios('users/manager', { ...params }).then((res) => {
        this.managers = res.data;
        this.pagination = res.meta;
      });
    },

    resetFilters() {
      this.filters = {
        name: '',
        branch: '',
        email: '',
        active: '',
        status: null,
        page: 1,
      };
      this.submitFilter();
    },
  },
};
</script>
