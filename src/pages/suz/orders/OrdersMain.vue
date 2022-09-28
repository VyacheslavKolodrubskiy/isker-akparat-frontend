<template>
  <div>
    <APageHeader title="Система управления заказами (СУЗ)">
      <template #extra>
        <AddLink v-if="$canUse(['manager'])" :to="{ name: 'OrderAdd' }" />
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
          <AFormItem label="Наименование">
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
          <AFormItem label="ID Заказа в ИС МПТ">
            <AInput
              v-model:value="filters.suz_order_id"
              placeholder="ID Заказа в ИС МПТ"
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
          <AFormItem label="Менеджер">
            <SelectManager
              v-model:value="filters.manager"
              placeholder="Менеджер"
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
          <AFormItem label="GTIN товара">
            <AInputNumber
              v-model:value="filters.gtin"
              placeholder="GTIN товара"
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
          <AFormItem label="Дата заказа">
            <QDatePicker
              v-model:value="filters.date"
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
          <AFormItem label="Способ изготовления">
            <SelectCreatedMethod
              v-model:value="filters.manufacture"
              placeholder="Способ изготовления"
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
          <AFormItem label="Страна производства">
            <SelectCountry
              v-model:value="filters.country"
              placeholder="Страна производства"
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
          <AFormItem label="Способ выпуска товаров">
            <SelectReleaseMethod
              v-model:value="filters.release"
              placeholder="Способ выпуска товаров"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          :lg="12"
          :md="16"
          :xs="24"
          :xxl="8">
          <AFormItem label="Статус">
            <SelectMarkingStatus
              v-model:value="filters.status"
              :max-tag-count="2"
              mode="multiple"
              placeholder="Статус"
              size="large"
              @change="debouncedSearch" />
          </AFormItem>
        </ACol>

        <ACol
          class="page-filter__reset"
          :lg="12"
          :xl="8"
          :xs="24"
          :xxl="4">
          <ResetButton @click="resetFilters" />
        </ACol>
      </ARow>
    </AForm>
    <QTable
      :actions="actions"
      :columns="columns"
      :data-source="orders"
      :pagination="pagination"
      @change="changeTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          <div class="lh-sm fz-14">
            <div>
              <span class="text-gray-500">Наименование:</span>
              {{ record.title }}
            </div>
            <div>
              <span class="text-gray-500">ID Заказа в ИС МПТ:<br></span>
              {{ record.suz_order_id }}
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'org'">
          <div class="lh-sm fz-12">
            <div>
              <span class="text-gray-500">Организация:</span>
              {{ record.counterparty.title }}
            </div>
            <div>
              <span class="text-gray-500">Автор заказа:</span>
              {{ record.contactPerson }}
            </div>
            <div>
              <span class="text-gray-500">Дата:</span>
              {{ $format(record.created_at, 'datetime') }}
            </div>
          </div>
        </template>
        <TableActions
          v-else-if="column.dataIndex === 'action'"
          :actions="actions"
          :record="record" />
        <StatusTag
          v-else-if="column.dataIndex === 'status'"
          :variant="getOrderStatusVariant(record.status.id)">
          {{ record.status.title }}
        </StatusTag>
      </template>
    </QTable>
  </div>
</template>
<script>
import { getOrderStatusVariant } from '@/utils/utils';
import { getAxios } from '@/services/http/request';
import { debounce } from '@/utils/lodash';
import { INPUT_DELAY } from '@/config/constants';

export default {
  name: 'Order',
  data() {
    return {
      filters: {
        date: null,
        title: '',
        suz_order_id: null,
        manager: null,
        gtin: null,
        manufacture: null,
        country: null,
        release: null,
        status: [],
        page: 1,
      },
      actions: [
        {
          to: (record) => ({
            name: 'OrderView',
            params: { id: record.id },
          }),
          title: 'Просмотр',
          condition: () => this.$canUse(['admin', 'manager']),
        },
        {
          to: (record) => ({
            name: 'OrderEdit',
            params: { id: record.id },
          }),
          title: 'Редактировать',
          condition: (record) => record.status.id === 0 && this.$canUse(['manager']),
        },
      ],
      orders: [],
      pagination: {},
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: 'Наименование / ID Заказа в ИС МПТ',
          dataIndex: 'title',
          width: 450,
        },
        {
          title: 'Общее кол-во КМ',
          dataIndex: 'km_count',
        },
        {
          title: 'Организация / Автор заказа / Дата',
          dataIndex: 'org',
        },
        {
          title: 'Статус',
          dataIndex: 'status',
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
    this.submitFilter();
  },
  methods: {
    debouncedSearch: debounce(function (){
      this.submitFilter();
    }, INPUT_DELAY),

    fetchOrders(params = {}) {
      return getAxios('/orders', { ...params }).then((res) => {
        this.orders = res.data;
        this.pagination = res.meta;
      },
      );
    },
    submitFilter() {
      this.fetchOrders(this.filters);
    },
    changeTable(pagination) {
      this.filters.page = pagination.current;
      this.submitFilter();
    },
    resetFilters() {
      this.filters = {
        date: null,
        title: '',
        suz_order_id: null,
        manager: null,
        gtin: null,
        manufacture: null,
        country: null,
        release: null,
        status: [],
        page: 1,
      };
      this.submitFilter();
    },
    getOrderStatusVariant,
  },
};
</script>
