<template>
  <div class="d-none" :class="{'d-block': isLoading}">
    <div
      class="spinner-wrapper">
      <ASpin size="large" />
    </div>
    <div class="ant-modal-mask"></div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      isLoading: 'globalSpinner/isLoading',
    }),
  },
};
</script>
