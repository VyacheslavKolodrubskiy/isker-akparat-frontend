<template>
  <AForm
    id="admin_form"
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
        <AFormItem label="ФИО" name="name">
          <AInput v-model:value="form.name" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem
          label="Телефон"
          name="phone"
          :rules="formRules.phone">
          <AInput
            v-model:value="form.phone"
            v-maska="'+7 (###) ### ## ##'"
            size="large"
            @maska="formattedPhone = $event.target.dataset.maskRawValue" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :xs="0" />

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Почта" name="email">
          <AInput
            v-model:value="form.email"
            autocomplete="new-password"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Пароль" name="password">
          <AInputPassword
            v-model:value="form.password"
            autocomplete="new-password"
            size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="8"
        :xs="0" />

      <ACol
        :lg="16"
        :xs="24"
        :xxl="12">
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
import { vvRequired, vvPhone } from '@/utils/form-validators';
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
        name: '',
        phone: '',
        email: '',
        note: '',
      },
      formattedPhone: '',
    };
  },
  created() {
    if (this.isEditing) {
      this.readAdmin();
    }
  },
  computed: {
    isEditing() {
      return !!this.dataId;
    },
    formRules() {
      return {
        name: vvRequired,
        phone: [
          vvRequired,
          vvPhone,
        ],
        email: vvRequired,
        password: {
          required: !this.isEditing,
          message: vvRequired.message,
        },
      };
    },
  },
  methods: {
    readAdmin() {
      return getAxios(`users/admin/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        this.form.name = data.name;
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
