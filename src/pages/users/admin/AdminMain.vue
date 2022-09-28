<template>
  <APageHeader title="Пользователи &quot;Администратор&quot;">
    <template #extra>
      <AddLink
        v-if="$canUse(['admin'])"
        :to="{ name: 'UsersAdminAdd' }" />
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
    :data-source="admins"
    :pagination="pagination"
    @change="changeTable">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'note'">
        {{ $format(record.note, 'truncate', { length: 90 }) }}
      </template>
      <template v-if="column.dataIndex === 'action'">
        <TableActions :actions="actions" :record="record" />
      </template>
    </template>
  </QTable>
</template>

<script>

import { getAxios } from '@/services/http/request';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';

export default {
  name: 'UsersAdmin',
  data() {
    return {
      filters: {
        name: '',
        email: '',
        page: 1,
      },
      actions: [
        {
          to: (record) => ({
            name: 'UsersAdminView',
            params: { id: record.id },
          }),
          title: 'Просмотр',
          condition: () => this.$canUse(['admin']),
        },
        {
          to: (record) => ({
            name: 'UsersAdminEdit',
            params: { id: record.id },
          }),
          title: 'Редактировать',
          condition: () => this.$canUse(['admin']),
        },
      ],
      admins: [],
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
          width: 289,
        },
        {
          title: 'Почта',
          dataIndex: 'email',
        },
        {
          title: 'Комментарий',
          dataIndex: 'note',
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
      this.fetchAdmins(this.filters);
    },

    fetchAdmins(params = {}) {
      return getAxios('users/admin', { ...params }).then((res) => {
        this.admins = res.data;
        this.pagination = res.meta;
      });
    },

    resetFilters() {
      this.filters = {
        name: '',
        email: '',
        page: 1,
      };
      this.submitFilter();
    },
  },
};
</script>
