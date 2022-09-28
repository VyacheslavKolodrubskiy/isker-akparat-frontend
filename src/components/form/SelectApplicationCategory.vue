<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="false"
    :options="options" />
</template>

<script>
import { getAxios } from '@/services/http/request';
import { extendForSelect } from '@/utils/utils';

export default {
  inheritAttrs: false,
  props: {
    filters: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      options: [],
    };
  },
  methods: {
    getOptions(params = {}) {
      getAxios('application/categories', { ...params, ...this.filters }).then((res) => {
        this.options = res.data.map((item) => extendForSelect(item, 'name'));
      });
    },
  },
  created() {
    this.getOptions();
  },
};
</script>
