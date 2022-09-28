<template>
  <div class="text-center">
    <img
      v-if="image"
      alt=""
      class="w-100 mb-3"
      :src="require(`@/assets/images/print-formats/${this.image}`)">

    <div class="font-weight-bold mb-4">
      {{ title }}
    </div>

    <PrintTryToDownload
      :check="checkUrlStatus"
      :download-url="downloadUrl"
      type="primary">
      Сгенерировать
    </PrintTryToDownload>
  </div>
</template>

<script>
import { getAxios } from '@/services/http/request';
import PrintTryToDownload from '@/pages/suz/print/components/PrintTryToDownload.vue';

export default {
  inheritAttrs: false,
  components: {
    PrintTryToDownload,
  },
  props: {
    image: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    printType: {
      type: Number,
      required: true,
    },
  },
  emits: ['generate'],
  data() {
    return {
      downloadUrl: null,
    };
  },
  computed: {
  },
  methods: {
    checkUrlStatus() {
      return getAxios(`print-groups/${this.$route.params.id}/pdf`, { printType: this.printType }, { globalLoading: true }).then((res) => {
        this.downloadUrl = res.data.url;
      });
    },
  },
};
</script>
