<template>
  <AForm
    id="profile_form"
    ref="profileForm"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish">
    <ARow :gutter="24">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="ФИО" name="name">
          <AInput v-model:value="form.name" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
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

      <ACol :md="8" :xs="0" />

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Почта" name="email">
          <AInput v-model:value="form.email" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Пароль" name="password">
          <AInputPassword v-model:value="form.password" size="large" />
        </AFormItem>
      </ACol>

      <ACol :md="16" :xs="24">
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
  emits: ['submit'],
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        phone: '',
        note: '',
      },
      formattedPhone: '',
    };
  },
  created() {
    this.readProfile();
  },
  computed: {
    isEmptyInputPassword() {
      return !this.form.password;
    },
    formRules() {
      return {
        name: vvRequired,
        email: vvRequired,
        phone: [
          vvRequired,
          vvPhone,
        ],
        password: {
          required: !this.isEmptyInputPassword,
          message: vvRequired.message,
        },
      };
    },
  },
  watch: {
    'form.password': function (newVal) {
      if (newVal) return;

      this.$nextTick()
        .then(() => this.$refs.profileForm.clearValidate('password'));
    },
  },
  methods: {
    readProfile() {
      return getAxios('profile', {}, { globalLoading: true })
        .then(({ data }) => {
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
