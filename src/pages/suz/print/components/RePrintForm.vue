<template>
  <AForm
    id="reprint_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish">
    <ARow :gutter="24">
      <ACol
        :md="12"
        :xs="24">
        <AFormItem label="Организация клиента" name="counterparty_id">
          <SelectCounterparty
            v-model:value="form.counterparty_id"
            disabled
            label-in-value
            size="large" />
        </AFormItem>
      </ACol>
      <ACol
        :md="12"
        :xs="24">
        <AFormItem label="Наименование" name="title">
          <AInput
            v-model:value="form.title"
            disabled
            size="large" />
        </AFormItem>
      </ACol>

      <ADivider />

      <ACol
        :lg="8"
        :md="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="ГРЗ/Область" name="region_id">
          <SelectRegion
            v-model:value="form.region_id"
            label-in-value
            size="large"
            @change="onChangeRegion" />
        </AFormItem>
      </ACol>
      <ACol
        :lg="8"
        :md="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Город" name="city_id">
          <SelectCity
            ref="selectCity"
            v-model:value="form.city_id"
            :filters="{ region_id: form.region_id?.value }"
            size="large"
            @change="onChangeCity" />
        </AFormItem>
      </ACol>
      <ACol
        :lg="8"
        :md="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Планируемая дата поставки" name="date_planned_delivery">
          <QDatePicker v-model:value="form.date_planned_delivery" size="large" />
        </AFormItem>
      </ACol>
      <ACol
        :lg="16"
        :md="12"
        :xs="24"
        :xxl="12">
        <AFormItem label="Адрес поставки" name="address_to_delivery">
          <AInput v-model:value="form.address_to_delivery" size="large" />
        </AFormItem>
      </ACol>
      <ACol
        :xs="24"
        :xxl="18">
        <AFormItem label="Комментарий" name="comment">
          <ATextarea
            v-model:value="form.comment"
            placeholder="Комментарий"
            rows="4"
            size="large" />
        </AFormItem>
      </ACol>
    </ARow>

    <ADivider />

    <ARow :gutter="24">
      <ACol
        :xs="18">
        <AFormItem>
          <AInput
            v-model:value="searchQuery"
            allow-clear
            placeholder="Введите код маркировки для поиска"
            size="large">
            <template #prefix>
              <QIcon type="search" />
            </template>
          </AInput>
        </AFormItem>

        <ATable
          :columns="columns"
          :data-source="filteredOrders"
          expand-row-by-click
          :indent-size="0"
          :pagination="false"
          row-key="id"
          :row-selection="{ selectedRowKeys: selectedCodes, onChange: onRowChange, fixed: true, checkStrictly: false }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'id'">
              {{ record.uiIndex }}
            </template>
            <template v-else-if="column.dataIndex === 'gtin'">
              <div
                v-if="record.code"
                class="break-all"
                v-html="record.code"></div>
            </template>
          </template>
        </ATable>
      </ACol>

      <ACol
        v-if="selectedCodesRowsFiltered.length"
        :xs="6">
        <AAffix class="ant-affix--overflow-visible">
          <div class="ant-transfer-list w-100" style="height:300px">
            <div class="ant-transfer-list-header">
              <span class="ant-transfer-list-header-selected"><span class="ant-transfer-list-header-title">Выбрано: {{ selectedCodesRowsFiltered.length }}</span></span>
            </div>
            <div class="ant-transfer-list-body">
              <ul class="ant-transfer-list-content">
                <li
                  v-for="selected in selectedCodesRowsFiltered"
                  :key="selected.id"
                  class="ant-transfer-list-content-item cursor-default"
                  :title="selected.code">
                  <span class="ant-transfer-list-content-item-text">{{ selected.code }}</span>
                </li>
              </ul>
            </div>
            <!--          <a href="#" @click.prevent>-->
            <!--            <QIcon class="text-danger" type="close" />-->
            <!--          </a>-->
          </div>
        </AAffix>
      </ACol>
    </ARow>
  </AForm>
</template>

<script>
import { vvRequired } from '@/utils/form-validators';
import { getAxios } from '@/services/http/request';
import { normalizeRePrintOrders } from '@/pages/suz/print/print-utils';
import { fastClone, getTextWithHighlights } from '@/utils/utils';
import { PRINT_STATUSES } from '@/config/types';
import SelectCity from '@/components/form/SelectCity';
import SelectRegion from '@/components/form/SelectRegion';
import SelectCounterparty from '@/components/form/SelectCounterparty';

const formRules = {
  counterparty_id: vvRequired,
  title: vvRequired,
  region_id: vvRequired,
  address_to_delivery: vvRequired,
  date_planned_delivery: vvRequired,
};
export default {
  components: { SelectCity, SelectRegion, SelectCounterparty },
  props: {
    dataId: {
      type: String,
      default: '',
    },
  },
  emits: ['submit', 'restricted'],
  data() {
    this.formRules = formRules;
    return {
      form: {
        title: '',
        counterparty_id: null,
        region_id: null,
        city_id: null,
        address_to_delivery: '',
        date_planned_delivery: '',
        comment: '',
      },
      parent: null,
      searchQuery: '',
      orders: [],
      selectedCodes: [],
      selectedCodesRows: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 100,
        },
        {
          title: 'GTIN/КМ',
          dataIndex: 'gtin',
        },
      ],
    };
  },
  created() {
    this.readPrint();
  },
  computed: {
    isEditing() {
      return !!this.parent;
    },
    filteredOrders() {
      if (!this.searchQuery) return this.orders;

      const searchableArr = fastClone(this.orders.reduce((acc, order) => acc.concat(order.children), []));

      return searchableArr.filter(order => {
        const found = order.code.indexOf(this.searchQuery) > -1;
        if (!found) return false;

        order.code = getTextWithHighlights(order.code, this.searchQuery);
        return true;
      });
    },
    selectedCodesRowsFiltered() {
      return this.selectedCodesRows.filter(this.isOrderHasCode);
    },
  },
  methods: {
    isOrderHasCode(order) {
      return !!order.code;
    },
    onChangeCity(_, fullValue) {
      if (!fullValue) return;
      this.form.region_id = { value: fullValue.region.id, label: fullValue.region.name };
    },
    refreshRegionOptions() {
      this.$nextTick().then(() => this.$refs.selectCity.getOptions());
    },
    onChangeRegion() {
      this.form.city_id = '';
      this.refreshRegionOptions();
    },

    onRowChange(selectedRowKeys, selectedRows) {
      this.selectedCodes = selectedRowKeys;
      this.selectedCodesRows = selectedRows;
    },

    readPrint() {
      getAxios(`reprint-groups/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        const isEditing = !!data.parent;
        if (isEditing) { // Если есть родитель - то это редактирование
          if (data.status.id !== PRINT_STATUSES.new.id) {
            // Можно редактировать "Повторную печать КМ" только со статусом "Новый"
            return this.$emit('restricted');
          }

          this.parent = data.parent;

          this.orders = normalizeRePrintOrders(data.parent.parent_print_orders);
          let selected = normalizeRePrintOrders(data.print_orders);
          this.selectedCodesRows = selected.reduce((acc, order) => acc.concat(order.children), []);
          this.selectedCodes = this.selectedCodesRows.map(row => row.id);
        } else {
          this.orders = normalizeRePrintOrders(data.print_orders);
        }

        this.form.title = isEditing ? data.title : `Повторная печать “${data.title}”`;

        this.form.counterparty_id = { label: data.counterparty.title, value: data.counterparty.id };
        this.form.region_id = { value: data.region.id, label: data.region.name };
        this.form.city_id = data.city?.id;
        this.form.address_to_delivery = data.address_to_delivery;
        this.form.date_planned_delivery = data.date_planned_delivery;
        this.form.comment = data.comment;

        this.refreshRegionOptions();
      });
    },

    serializeOrders() {
      return this.selectedCodesRowsFiltered
        .map(row => ({ id: row.id, order_id: row.order_id }));
    },
    handleFinish(values) {
      values.region_id = values.region_id.value;
      values.counterparty_id = values.counterparty_id.value;
      const data = {
        ...values,
        print_barcodes: this.serializeOrders(),
      };
      if (!this.isEditing) {
        data.parent_id = this.dataId;
      }

      this.$emit('submit', data);
    },

  },
};
</script>
