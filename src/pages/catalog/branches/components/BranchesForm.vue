<template>
  <AForm
    id="branches_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="handleFinish">
    <ARow :gutter="24">
      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="10">
        <AFormItem label="Наименование" name="title">
          <AInput v-model:value="form.title" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
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
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="Город" name="city_id">
          <SelectCity
            ref="selectCity"
            v-model:value="form.city_id"
            :filters="{region_id: form.region_id?.value}"
            size="large"
            @change="onChangeCity" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="10">
        <AFormItem label="Адрес" name="address">
          <AInput v-model:value="form.address" size="large" />
        </AFormItem>
      </ACol>

      <ACol
        :md="8"
        :sm="12"
        :xs="24"
        :xxl="6">
        <AFormItem label="E-mail" name="email">
          <AInput v-model:value="form.email" size="large" />
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

      <ACol
        :lg="16"
        :xs="24"
        :xxl="10">
        <AFormItem label="Местоположение" name="location">
          <SelectMapPoint v-model:point="form.location" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="16"
        :xs="24">
        <AFormItem label="Комментарий" name="note">
          <ATextarea v-model:value="form.note" rows="4" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24">
        <AFormItem label="Активность" name="is_active">
          <ARadioGroup v-model:value="form.is_active">
            <ARadio :value="true">
              Да
            </ARadio>
            <ARadio :value="false">
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
import SelectMapPoint from '@/components/form/SelectMapPoint.vue';

export default {
  name: 'BranchesForm',
  components: { SelectMapPoint },
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
        title: '',
        region_id: null,
        city_id: '',
        address: '',
        email: '',
        phone: '',
        location: '',
        note: '',
        is_active: null,
      },
      formattedPhone: '',
    };
  },
  created() {
    if (this.isEditing) {
      this.readBranch();
    }
  },
  computed: {
    isEditing() {
      return !!this.dataId;
    },
    formRules() {
      return {
        title: vvRequired,
        region_id: vvRequired,
        address: vvRequired,
        location: vvRequired,
        email: vvRequired,
        phone: [
          vvRequired,
          vvPhone,
        ],
      };
    },
  },
  methods: {
    onChangeCity(_, fullValue) {
      if (!fullValue) return;
      this.form.region_id = { value: fullValue.region.id, label: fullValue.region.name };
    },
    refreshCityOptions() {
      this.$nextTick().then(() => this.$refs.selectCity.getOptions());
    },
    onChangeRegion() {
      this.form.city_id = '';
      this.refreshCityOptions();
    },
    readBranch() {
      return getAxios(`branch/${this.dataId}`, {}, { globalLoading: true }).then(({ data }) => {
        this.form.title = data.title;
        this.form.region_id = { value: data.region.id, label: data.region.name };
        this.form.city_id = data.city?.id;
        this.form.address = data.address;
        this.form.email = data.email;
        this.form.phone = mask(data.phone + '', '+7 (###) ### ## ##');
        this.form.location = data.location;
        this.form.note = data.note;
        this.form.is_active = data.is_active;

        this.refreshCityOptions();
      });
    },

    handleFinish(values) {
      values.region_id = values.region_id.value;
      values.is_active = +values.is_active;
      values.phone = this.formattedPhone ? '7' + this.formattedPhone : values.phone;
      this.$emit('submit', values);
    },
  },
};
</script>
