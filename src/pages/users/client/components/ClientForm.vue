<template>
  <AForm
    id="client_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish">
    <ARow :gutter="24">
      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Организация" name="counterparty_id">
          <SelectCounterparty
            v-model:value="form.counterparty_id"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24">
        <AFormItem label="ФИО" name="name">
          <AInput v-model:value="form.name" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24">
        <AFormItem label="ИИН" name="iin">
          <AInput
            v-model:value="form.iin"
            v-maska="'############'"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :xs="0" />

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Почта" name="email">
          <AInput v-model:value="form.email" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Пароль" name="password">
          <AInputPassword v-model:value="form.password" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :md="8"
        :sm="12"
        :xs="24">
        <AFormItem label="Телефон" name="phone">
          <AInput
            v-model:value="form.phone"
            v-maska="'+7 (###) ### ## ##'"
            size="large"
            @maska="formattedPhone = $event.target.dataset.maskRawValue" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="12"
        :md="16"
        :xs="24">
        <AFormItem label="Комментарий" name="note">
          <ATextarea
            v-model:value="form.note"
            rows="4"
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
        counterparty_id: '',
        name: '',
        iin: '',
        email: '',
        password: '',
        phone: '',
        note: '',
      },
      formattedPhone: '',
    };
  },
  created() {
    if (this.isEditing) {
      this.readClient();
    }
  },
  computed: {
    isEditing() {
      return !!this.dataId;
    },
    formRules() {
      return {
        counterparty_id: vvRequired,
        name: vvRequired,
        iin: [
          vvRequired,
          vvBinIin,
        ],
        email: vvRequired,
        phone: [
          vvRequired,
          vvPhone,
        ],
        password: {
          required: !this.isEditing,
          message: vvRequired.message,
        },
      };
    },
  },
  methods: {
    readClient() {
      return getAxios(`users/customer/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        this.form.counterparty_id = data.counterpartyUser?.id;
        this.form.name = data.name;
        this.form.iin = data.iin + '';
        this.form.email = data.email;
        this.form.phone = mask(data.phone + '', '+7 (###) ### ## ##');
        this.form.note = data.note;
      });
    },

    handleFinish(values) {
      values.phone = this.formattedPhone ? '7' + this.formattedPhone : values.phone;
      this.$emit('submit', values);
    },
  },
};
</script>
