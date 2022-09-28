<template>
  <ASelect
    v-bind="$attrs"
    allow-clear
    :filter-option="false"
    :options="options" />
</template>

<script>
import { extendForSelect } from '@/utils/utils';
import { GROUP_STATUSES } from '@/config/types';

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
    statuses() {
      const statuses = Object.values(GROUP_STATUSES);
      this.options = statuses.map((item) => extendForSelect(item, 'title'));
    },
  },
  created() {
    this.statuses();
  },
};
</script>
