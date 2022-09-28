<template>
  <APageHeader title="Мой профиль">
    <template #extra>
      <CancelButton />
      <SubmitButton form="profile_form" />
    </template>
  </APageHeader>

  <ACard>
    <ProfileForm
      @submit="submit" />

    <a
      v-if="!bot.subscribed && $canUse(['manager', 'client', 'admin'])"
      class="ant-btn ant-btn-lg btn--telegram"
      :href="bot.url"
      target="_blank">
      Подписаться на рассылку в Telegram
    </a>

    <QBtn
      v-else-if="bot.subscribed && $canUse(['manager', 'client', 'admin'])"
      danger
      size="large"
      type="primary"
      @click="subscr">
      Отписаться от рассылки в Telegram
    </QBtn>
  </ACard>
</template>

<script>
import { getAxios, putAxios } from '@/services/http/request';
import ProfileForm from '@/pages/profile/components/ProfileForm';

export default {
  name: 'UsersProfileEdit',
  components: {
    ProfileForm,
  },
  data() {
    return {
      bot: {},
    };
  },
  created() {
    this.checkSubscribeStatus();
  },
  methods: {
    subscr() {
      this.unsubscribe().then((res) => this.checkSubscribeStatus());
    },
    checkSubscribeStatus() {
      return getAxios('/subscription/telegram/check', {}, { serverErrorRedirect: false, globalLoading: true })
        .then((res) => {
          this.bot = res.data;
        });
    },
    unsubscribe() {
      return getAxios('/subscription/telegram/unsubscribe', {}, { serverErrorRedirect: false, globalLoading: true })
        .then((res) => {
          this.bot = res.data;
          return res;
        });
    },
    submit(values) {
      putAxios('profile', values, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Успешно обновлен',
        });
      });
    },
  },
};
</script>
