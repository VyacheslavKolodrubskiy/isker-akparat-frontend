<template>
  <AForm
    id="order_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish">
    <ARow :gutter="24">
      <ACol
        :lg="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Организация Клиента" name="counterparty_id">
          <SelectCounterparty
            v-model:value="form.counterparty_id"
            label-in-value
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="18"
        :xs="0" />

      <ACol
        :lg="16"
        :sm="12"
        :xs="24">
        <AFormItem label="Наименование" name="title">
          <AInput v-model:value="form.title" size="large" />
        </AFormItem>
      </ACol>

      <ADivider />

      <ACol
        :xs="24">
        <h2 class="section-title">
          Данные производства
        </h2>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Контактное лицо" name="contactPerson">
          <AInput v-model:value="form.contactPerson" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Способ формирования индивидуального серийного номера" required>
          <AInput
            disabled
            placeholder="Автоматически"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :xs="0" />

      <ACol
        :lg="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Способ изготовления" name="create_method_type_id">
          <SelectCreatedMethod
            v-model:value="form.create_method_type_id"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Страна производства" name="country_id">
          <SelectCountry v-model:value="form.country_id" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24">
        <AFormItem
          label="Способ выпуска товаров в оборот"
          name="release_method_type_id">
          <SelectReleaseMethod
            v-model:value="form.release_method_type_id"
            size="large" />
        </AFormItem>
      </ACol>

      <ADivider />

      <ACol
        :xs="24">
        <h2 class="section-title">
          Товары
        </h2>
      </ACol>
    </ARow>
    <QTable
      :columns="columns"
      :data-source="formData"
      :row-class-name="'marking-code-add-table'">
      <template #bodyCell="{ column, record, index }">
        <AFormItem
          v-if="column.dataIndex === 'gtin'"
          v-maska="'0#############'"
          :name="['products', index, 'gtin']"
          :rules="gtinRule">
          <AInput
            v-model:value="record.gtin" />
        </AFormItem>
        <AFormItem
          v-if="column.dataIndex === 'quantity'"
          :name="['products', index, 'quantity']"
          :rules="quantityRule">
          <AInput
            v-model:value="record.quantity" />
        </AFormItem>
        <AFormItem v-if="column.dataIndex === 'operation'">
          <div class="text-right">
            <a @click="onDelete(record.key)">
              <QIcon style="color: red" type="close" />
            </a>
          </div>
        </AFormItem>
      </template>
      <template #footer>
        <QBtn
          v-if="!isGtinLimitReached"
          class="mt-3"
          type="primary"
          @click="handleAdd">
          <QIcon type="plus" />
          Добавить
        </QBtn>
      </template>
    </QTable>
  </AForm>
</template>

<script>
import { getAxios } from '@/services/http/request';
import { vvRequired } from '@/utils/form-validators';

export default {
  props: {
    dataId: {
      type: String,
      default: '',
    },
  },
  emits: ['submit'],
  data() {
    return {
      form: {
        counterparty_id: null,
        title: '',
        contactPerson: '',
        release_method_type_id: '',
        create_method_type_id: '',
        country_id: '',
        products: [],
      },
      count: 1,
      formData: [],
    };
  },
  created() {
    if (this.isEditing) {
      this.readOrder();
    }
  },
  computed: {
    isEditing() {
      return !!this.dataId;
    },
    columns() {
      return [
        {
          title: '№',
          dataIndex: 'key',
          width: 65,
        },
        {
          title: 'GTIN',
          dataIndex: 'gtin',
          width: '30%',
        },
        {
          title: 'Количество КМ',
          dataIndex: 'quantity',
          width: '30%',
        },
        {
          dataIndex: 'operation',
        },
      ];
    },
    isGtinLimitReached() {
      return this.form.products.length >= 100;
    },
    gtinRule() {
      return [
        vvRequired,
        {
          len: 14,
          message: 'Поле gtin должно состоять из 14 знаков',
        },
        {
          validator: this.gtinValidator,
          trigger: 'change',
        },
      ];
    },
    quantityRule() {
      return [
        vvRequired,
        {
          validator: this.quantityValidator,
          trigger: 'change',
        },
      ];
    },
    formRules() {
      return {
        counterparty_id: vvRequired,
        title: vvRequired,
        contactPerson: vvRequired,
        release_method_type_id: vvRequired,
        create_method_type_id: vvRequired,
        country_id: vvRequired,
      };
    },
  },
  methods: {
    readOrder() {
      getAxios(`orders/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        this.form.counterparty_id = { value: data.counterparty.id, label: data.counterparty.title },
        this.form.title = data.title,
        this.form.contactPerson = data.contactPerson,
        this.form.release_method_type_id = data.releaseMethodType.id,
        this.form.create_method_type_id = data.createMethodType.id,
        this.form.country_id = data.country.id,
        this.form.products = data.orderItems;
        this.formData = data.orderItems;
        this.formData.forEach((el, i) => {
          el.key = i + 1;
          el.quantity = el.quantity + '';
        });
      });
    },
    handleFinish(values) {
      values.products = this.form.products;
      values.counterparty_id = values.counterparty_id.value;
      this.$emit('submit', values);
    },
    handleAdd() {
      const { count, formData } = this;
      const newData = {
        key: this.formData.length + 1,
        templateId: 1,
        gtin: '',
        quantity: '',
        serialNumberType: 'OPERATOR',
      };
      this.formData = [...formData, newData];
      this.editable = true;
      this.form.products = this.formData;
    },
    async gtinValidator(_rule, value){
      return this.formData.filter(el => el.gtin === value).length > 1 ? Promise.reject('Поле gtin должно быть уникальным') : Promise.resolve();
    },
    async quantityValidator(_rule, value) {
      return value > 150000 ? Promise.reject('Количество кодов маркировки не может превышать 150000') : Promise.resolve();
    },
    onDelete(key) {
      const dataSource = [...this.formData];
      this.formData = dataSource.filter((item) => item.key !== key);
      this.formData.forEach((el, i) => {
        this.count = i + 1;
        el.key = this.count;
      });
      this.form.products = this.formData;
    },
  },
};
</script>
