<template>
  <ATable
    v-bind="$attrs"
    :pagination="getPagination"
    row-key="id"
    :scroll="{ x: $isMobile ? 1024 : true}">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{...slotData}"></slot>
    </template>
    <template v-if="pagination" #footer>
      <span>Показано {{ getDataLength }} из <strong>{{ pagination.total }}</strong></span>
    </template>
  </ATable>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    pagination: {
      type: Object,
      default: null,
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    getDataLength() {
      return this.$attrs['data-source']?.length || 0;
    },
    getPagination() {
      if (!this.pagination || this.pagination.last_page === 1) return false;

      return {
        pageSize: this.pagination.per_page || 20,
        total: this.pagination.total || 1,
        current: this.pagination.current_page || 1,
        showSizeChanger: false,
      };
    },
  },
};
</script>
