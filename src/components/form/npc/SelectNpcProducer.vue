<template>
  <ASelect
    v-bind="$attrs"
    :filter-option="filterOption"
    :not-found-content="null"
    :options="options"
    show-search />
</template>

<script>
import { extendForSelect } from '@/utils/utils';
import { getAxios } from '@/services/http/request';

export default {
  inheritAttrs: false,
  props: {
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
      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    getOptions() {
      getAxios('nkt/lib/product-parties').then((res) => {
        res.data.unshift({ id: 0, title: 'Заполнить самостоятельно', value: 0 });
        this.options = res.data.map((item) => extendForSelect(item, this.optionValue));
      });
    },
  },
  created() {
    this.getOptions();

    this.options = this.options.map((item) => extendForSelect(item, 'title'));
  },
};
</script>
