<template>
  <AForm
    id="organizations_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish">
    <ARow :gutter="24">
      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Наименование организации" name="title">
          <AInput
            v-model:value="form.title"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="ИИН/БИН" name="bin">
          <AInput
            v-model:value="form.bin"
            v-maska="'############'"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Юр.адрес" name="legal_address">
          <AInput
            v-model:value="form.legal_address"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="0"
        :xxl="6" />

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Факт.адрес" name="fact_address">
          <AInput
            v-model:value="form.fact_address"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="ИИК" name="iik">
          <AInput
            v-model:value="form.iik"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="БИК" name="bik">
          <AInput
            v-model:value="form.bik"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="0"
        :xxl="6" />

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Банк" name="bank">
          <AInput
            v-model:value="form.bank"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="E-mail" name="email">
          <AInput
            v-model:value="form.email"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Телефон" name="phone">
          <AInput
            v-model:value="form.phone"
            v-maska="'+7 (###) ### ## ##'"
            size="large"
            @maska="formattedPhone = $event.target.dataset.maskRawValue" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="16"
        :xs="24"
        :xxl="12">
        <AFormItem label="Комментарий" name="comment">
          <ATextarea v-model:value="form.comment" rows="4" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :xl="8"
        :xs="0"
        :xxl="12" />

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Apikey (НКТ)" name="api_key">
          <AInput
            v-model:value="form.api_key"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="ClientToken (СУЗ)" name="client_token">
          <AInput
            v-model:value="form.client_token"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="OMS ID" name="oms_id">
          <AInput
            v-model:value="form.oms_id"
            size="large" />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script>
import { getAxios } from '@/services/http/request';
import { vvRequired, vvBinIin, vvPhone } from '@/utils/form-validators';
import { mask } from 'maska';

const formRules = {
  title: vvRequired,
  bin: [
    vvRequired,
    vvBinIin,
  ],
  legal_address: vvRequired,
  fact_address: vvRequired,
  iik: vvRequired,
  bik: vvRequired,
  bank: vvRequired,
  email: vvRequired,
  phone: [
    vvRequired,
    vvPhone,
  ],
};

export default {
  name: 'OrganizationsForm',
  props: {
    dataId: {
      type: String,
      default: '',
    },
  },
  emits: ['submit'],
  data() {
    this.formRules = formRules;
    return {
      form: {
        title: '',
        bin: '',
        legal_address: '',
        fact_address: '',
        iik: '',
        bik: '',
        bank: '',
        email: '',
        phone: '',
        comment: '',
        api_key: '',
        client_token: '',
        oms_id: '',
      },
      formattedPhone: '',
    };
  },
  created() {
    if (this.isEditing) {
      this.readCounterparty();
    }
  },
  computed: {
    isEditing() {
      return !!this.dataId;
    },
  },
  methods: {
    readCounterparty() {
      return getAxios(`counterparties/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        this.form.title = data.title;
        this.form.bin = data.bin + '';
        this.form.legal_address = data.legal_address;
        this.form.fact_address = data.fact_address;
        this.form.iik = data.iik;
        this.form.bik = data.bik;
        this.form.bank = data.bank;
        this.form.email = data.email;
        this.form.phone = mask(data.phone + '', '+7 (###) ### ## ##');
        this.form.comment = data.comment;
        this.form.api_key = data.api_key;
        this.form.client_token = data.client_token;
        this.form.oms_id = data.oms_id;
      });
    },

    handleFinish(values) {
      values.phone = this.formattedPhone ? '7' + this.formattedPhone : values.phone;
      this.$emit('submit', values);
    },
  },
};
</script>
