<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="filterOption"
    :not-found-content="null"
    :options="options"
    show-search />
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
    optionValue: {
      type: String,
      default: 'title',
    },
  },
  data() {
    return {
      options: [],
    };
  },
  methods: {
    filterOption(input, option) {
      return option[this.optionValue].toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    getOptions(params = {}) {
      getAxios('nkt/lib/package-materials', { ...params, ...this.filters }).then((res) => {
        this.options = res.data.map((item) => extendForSelect(item, this.optionValue));
      });
    },
  },
  created() {
    this.getOptions();
  },
};
</script>
