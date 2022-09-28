<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="false"
    :options="options" />
</template>

<script>
import { PRODUCT_STATUSES } from '@/config/types';
import { extendForSelect } from '@/utils/utils';

export default {
  inheritAttrs: false,
  data() {
    return {
      options: [],
    };
  },
  methods: {
    getOptions(params = {}) {
      this.options = Object.values(PRODUCT_STATUSES).map((item) => extendForSelect(item, 'title'));
    },
  },
  created() {
    this.getOptions();
  },
};
</script>
