<template>
  <component :is="iconName" />
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'outlined',
    },
  },
  computed: {
    iconName() {
      return `${this.type}-${this.theme}`;
    },
  },
};
</script>
