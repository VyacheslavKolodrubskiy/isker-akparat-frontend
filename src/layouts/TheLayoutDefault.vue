<template>
  <AConfigProvider :locale="locale">
    <ALayout class="default-layout">
      <TheSidebar />
      <ALayout>
        <Header />
        <ALayoutContent>
          <router-view />
        </ALayoutContent>
      </ALayout>

      <TheGlobalOverlay />
      <TheGlobalSpinner />
    </ALayout>
  </AConfigProvider>
</template>

<script>
import locale from 'ant-design-vue/es/locale/ru_RU';
import TheSidebar from '@/components/TheSidebar.vue';
import Header from '@/components/TheHeader.vue';
import TheGlobalOverlay from '@/components/TheGlobalOverlay.vue';
import TheGlobalSpinner from '@/components/TheGlobalSpinner.vue';

export default {
  name: 'DefaultLayout',
  components: {
    TheGlobalOverlay,
    TheGlobalSpinner,
    TheSidebar,
    Header,
  },
  data() {
    return {
      locale,
    };
  },
};
</script>
