<template>
  <div class="auth">
    <div class="auth__container">
      <div class="auth__logo">
        <img
          alt=""
          draggable="false"
          src="@/assets/images/logo-iqid-black.svg">
      </div>

      <ACard>
        <AForm
          layout="vertical"
          :model="form"
          :rules="formRules"
          @finish="handleFinish">
          <h1>Авторизация</h1>

          <AFormItem label="Логин" name="email">
            <AInput
              v-model:value="form.email"
              placeholder="Логин"
              size="large" />
          </AFormItem>

          <AFormItem label="Пароль" name="password">
            <AInputPassword
              v-model:value="form.password"
              placeholder="Пароль"
              size="large" />
          </AFormItem>

          <QBtn
            :disabled="loading"
            html-type="submit"
            :loading="loading"
            size="large"
            type="primary">
            Войти
          </QBtn>
        </AForm>
      </ACard>
    </div>
  </div>
</template>

<script>
import { vvRequired } from '@/utils/form-validators';
import { DEFAULT_LOGGED_IN_ROUTE_NAME } from '@/config/constants';

const formRules = {
  email: vvRequired,
  password: [
    {
      ...vvRequired,
    },
    {
      min: 6,
      message: 'Длина пароля должна быть более 6 символов',
    },
  ],
};
export default {
  name: 'Login',
  data() {
    this.formRules = formRules;
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
    };
  },
  methods: {
    handleFinish() {
      this.loading = true;
      this.$store.dispatch('auth/login', this.form).then(() => {
        const routeLocation = this.$route.query.redirect ? { path: this.$route.query.redirect } : { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
        this.$router.push(routeLocation);
      })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
