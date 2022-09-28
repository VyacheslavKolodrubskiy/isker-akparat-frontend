<template>
  <AForm
    id="manager_form"
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
        <AFormItem label="Филиал" name="branch_id">
          <SelectBranch v-model:value="form.branch_id" size="large" />
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
        <AFormItem label="Телефон" name="phone">
          <AInput
            v-model:value="form.phone"
            v-maska="'+7 (###) ### ## ##'"
            size="large"
            @maska="formattedPhone = $event.target.dataset.maskRawValue" />
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
        :xs="0" />

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

      <ACol
        :xs="24">
        <AFormItem label="Активность" name="status_id">
          <ARadioGroup v-model:value="form.status_id">
            <ARadio :value="1">
              Да
            </ARadio>
            <ARadio :value="0">
              Нет
            </ARadio>
          </ARadioGroup>
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
        branch_id: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        note: '',
        status_id: null,
      },
      formattedPhone: '',
    };
  },
  created() {
    if (this.isEditing) {
      this.readManager();
    }
  },
  computed: {
    isEditing() {
      return !!this.dataId;
    },
    formRules() {
      return {
        branch_id: vvRequired,
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
    readManager() {
      return getAxios(`users/manager/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        this.form.branch_id = data.branchUser?.id;
        this.form.name = data.name;
        this.form.phone = data.phone;
        this.form.email = data.email;
        this.form.status_id = +data.is_active;
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
