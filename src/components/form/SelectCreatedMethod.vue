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
  emits: ['search'],
  data() {
    return {
      options: [],
    };
  },
  methods: {
    getOptions() {
      getAxios('/lib/create-method-types').then((res) => {
        this.options = res.data.map((item) => extendForSelect(item, 'title'));
      });
    },
  },
  created() {
    this.getOptions();
  },
};
</script>
