<template>
  <component
    :is="href ? 'a' : 'RouterLink'"
    v-bind="$attrs"
    class="ant-btn"
    :class="[btnClass,btnSize]"
    :href="href"
    :to="to">
    <slot></slot>
  </component>
</template>

<script>
const antBtnTypes = ['primary', 'ghost', 'dashed', 'danger', 'link'];
const antBtnSize = { small: 'sm', default: '', large: 'lg' };
export default {
  inheritAttrs: false,
  name: 'ButtonLink',
  props: {
    size: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'primary',
    },
    block: {
      type: Boolean,
      default: false,
    },
    to: {
      type: Object,
      default: null,
    },
    href: {
      type: String,
      default: '',
    },
  },
  computed: {
    btnClass() {
      return antBtnTypes.includes(this.type) ? `ant-btn-${this.type}` : `btn--${this.type}`;
    },
    btnSize() {
      return antBtnSize[this.size] ? `ant-btn-${antBtnSize[this.size]}` : null;
    },
  },
};
</script>
