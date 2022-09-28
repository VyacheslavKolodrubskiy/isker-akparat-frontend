<template>
  <transition name="fade">
    <div v-if="visible" class="global-overlay">
      <div v-if="message" class="global-overlay__message">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      visible: (state) => state.globalOverlay.visible,
      message: (state) => state.globalOverlay.message,
    }),
  },
};
</script>
