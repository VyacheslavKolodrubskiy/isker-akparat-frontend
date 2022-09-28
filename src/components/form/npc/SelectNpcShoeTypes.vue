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
  data() {
    return {
      options: [],
    };
  },
  methods: {
    filterOption(input, option) {
      return option['title'].toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    getOptions() {
      getAxios('nkt/lib/shoe-types').then((res) => {
        this.options = res.data.map((item) => extendForSelect(item, 'title'));
      });
    },
  },
  created() {
    this.getOptions();
  },
};
</script>
