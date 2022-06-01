<template>
  <SfModal
    v-e2e="'login-modal'"
    :visible="isLoginModalOpen"
    class="modal"
    @close="closeModal"
  >
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="$t(barTitle)"
        @click:close="closeModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div v-if="currentScreen === SCREEN_LOGIN">
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleLogin)">
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-email'"
                v-model="form.username"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                label="Your email"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-password'"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                label="Password"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <SfCheckbox
              v-e2e="'login-modal-remember-me'"
              v-model="rememberMe"
              name="remember-me"
              label="Remember me"
              class="form__element checkbox"
            />
            <SfButton v-e2e="'login-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t('Login') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="action">
          <SfButton class="sf-button--text" @click="setCurrentScreen(SCREEN_FORGOTTEN)">
            {{ $t('Forgotten password?') }}
          </SfButton>
        </div>
        <div class="bottom">
          <p class="bottom__paragraph">{{ $t('No account') }}</p>
          <SfButton class="sf-button--text" @click="setCurrentScreen(SCREEN_REGISTER)">
            {{ $t('Register today') }}
          </SfButton>
        </div>
      </div>
      <div v-else-if="currentScreen === SCREEN_FORGOTTEN">
        <p>{{ $t('Forgot Password') }}</p>
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleForgotten)">
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'forgot-modal-email'"
                v-model="form.username"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                :label="$t('Forgot Password Modal Email')"
                class="form__element"
              />
            </ValidationProvider>
            <div v-if="forgotPasswordError.request">
              {{ forgotPasswordError.request.message }}
            </div>
            <SfButton
              v-e2e="'forgot-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="forgotPasswordLoading"
            >
              <SfLoader :class="{ loader: forgotPasswordLoading }" :loading="forgotPasswordLoading">
                <div>{{ $t('Reset Password') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
      </div>
      <div v-else-if="currentScreen === SCREEN_THANK_YOU" class="thank-you">
        <i18n tag="p" class="thank-you__paragraph" path="forgotPasswordConfirmation">
          <span class="thank-you__paragraph--bold">{{ userEmail }}</span>
        </i18n>
        <p class="thank-you__paragraph">{{ $t('Thank You Inbox') }}</p>
      </div>
      <div v-else class="form">
        <ValidationObserver v-slot="{ handleSubmit }" key="sign-up">
          <form class="form" @submit.prevent="handleSubmit(handleRegister)" autocomplete="off">
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-email'"
                v-model="form.email"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                label="Your email"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|min:2|max:36" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-firstName'"
                v-model="form.firstName"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="first-name"
                label="First Name"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|min:2|max:36" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-lastName'"
                v-model="form.lastName"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="last-name"
                label="Last Name"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|password" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-password'"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                label="Password"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider :rules="{ required: { allowFalse: false } }" v-slot="{ errors }">
              <SfCheckbox
                v-e2e="'login-modal-create-account'"
                v-model="createAccount"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="create-account"
                label="I want to create an account"
                class="form__element"
              />
            </ValidationProvider>
            <SfButton
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t('Create an account') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="action">
          {{ $t('or') }}
          <SfButton class="sf-button--text" @click="setCurrentScreen(SCREEN_LOGIN)">
            {{ $t('login in to your account') }}
          </SfButton>
        </div>
      </div>
    </transition>
  </SfModal>
</template>
<script>
import { ref, watch, reactive, computed } from '@nuxtjs/composition-api';
import { SfModal, SfInput, SfButton, SfCheckbox, SfLoader, SfAlert, SfBar } from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email, min, max, password } from 'vee-validate/dist/rules';
import { useUser, useCart, useForgotPassword, useConfiguration, configurationGetters } from '@vue-storefront/orc-vsf';
import { useUiState } from '~/composables';
import { useUiNotification } from '~/composables';

extend('email', {
  ...email,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('max', {
  ...max,
  message: 'The field should have not more then {length} characters'
});

export default {
  name: 'LoginModal',
  components: {
    SfModal,
    SfInput,
    SfButton,
    SfCheckbox,
    SfLoader,
    SfAlert,
    ValidationProvider,
    ValidationObserver,
    SfBar
  },
  setup() {
    const SCREEN_LOGIN = 'login';
    const SCREEN_REGISTER = 'register';
    const SCREEN_THANK_YOU = 'thankYouAfterForgotten';
    const SCREEN_FORGOTTEN = 'forgottenPassword';

    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const form = ref({});
    const userEmail = ref('');
    const createAccount = ref(false);
    const rememberMe = ref(false);
    const { register, login, loading, error: userError } = useUser();
    const { load: reloadCart, clear: clearCart } = useCart();
    const { request, error: forgotPasswordError, loading: forgotPasswordLoading } = useForgotPassword();
    const currentScreen = ref(SCREEN_REGISTER);
    const { send: sendNotification } = useUiNotification();
    const { response: configuration } = useConfiguration();

    extend('password', {
      ...password,
      validate(value) {
        const minRequiredPasswordLength = configurationGetters.getMinRequiredPasswordLength(configuration.value);
        const minRequiredNonAlphanumericCharacters = configurationGetters.getMinRequiredNonAlphanumericCharacters(configuration.value);
        return new RegExp(`^(?=.*?[#?!@$%^&*+-_)()]{${minRequiredNonAlphanumericCharacters}}).{${minRequiredPasswordLength},}$`).test(value);
      },
      message: 'Your password must have a minimum 6 characters including at least 1 special character'
    });

    const error = reactive({
      login: null,
      register: null
    });

    const resetErrorValues = () => {
      error.login = null;
      error.register = null;
    };

    const barTitle = computed(() => {
      switch (currentScreen.value) {
        case SCREEN_LOGIN:
          return 'Sign in';
        case SCREEN_REGISTER:
          return 'Register';
        default:
          return 'Reset Password';
      }
    });

    watch(isLoginModalOpen, () => {
      if (isLoginModalOpen) {
        form.value = {};
        resetErrorValues();
      }
    });

    const setCurrentScreen = (screenName) => {
      resetErrorValues();
      currentScreen.value = screenName;
    };

    const handleForm = (fn, isRegister = false) => async () => {
      resetErrorValues();
      await fn({ user: form.value });

      const hasUserErrors = userError.value.register || userError.value.login;

      if (hasUserErrors) {
        error.login = userError.value.login?.message;
        error.register = userError.value.register?.message;

        if (error.register) {
          sendNotification({
            id: Symbol('user_registration'),
            message: 'The specified email already exists in the system.',
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'User Registration'
          });
        }

        if (error.login) {
          sendNotification({
            id: Symbol('user_login'),
            message: 'An error occured while logging in. Please check your username or password.',
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'User Login'
          });
        }

        return;
      } else if (isRegister) {
        sendNotification({
          id: Symbol('user_created'),
          message: 'The user account was successfully registered and logged in.',
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'User Registration'
        });
      }

      toggleLoginModal();
    };

    const closeModal = () => {
      resetErrorValues();
      setCurrentScreen(SCREEN_LOGIN);
      toggleLoginModal();
    };

    const handleRegister = async () => {
      await handleForm(register, true)();
      const hasUserErrors = userError.value.register || userError.value.login;
      if (!hasUserErrors) {
        await clearCart();
        reloadCart();
      }
    };

    const handleLogin = async () => {
      await handleForm(login)();
      const hasUserErrors = userError.value.register || userError.value.login;
      if (!hasUserErrors) {
        await clearCart();
        reloadCart();
      }
    };

    const handleForgotten = async () => {
      userEmail.value = form.value.username;
      await request({ email: userEmail.value });

      if (!forgotPasswordError.value.request) {
        setCurrentScreen(SCREEN_THANK_YOU);
      }
    };

    return {
      form,
      error,
      userError,
      loading,
      createAccount,
      rememberMe,
      isLoginModalOpen,
      toggleLoginModal,
      handleLogin,
      handleRegister,
      forgotPasswordError,
      forgotPasswordLoading,
      handleForgotten,
      closeModal,
      userEmail,
      barTitle,
      currentScreen,
      setCurrentScreen,
      SCREEN_LOGIN,
      SCREEN_REGISTER,
      SCREEN_THANK_YOU,
      SCREEN_FORGOTTEN
    };
  }
};
</script>

<style lang="scss" scoped>

.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}
.form {
  margin-top: var(--spacer-sm);
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
  }
}
.action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6 var(--font-family--secondary);
  & > * {
    margin: 0 0 0 var(--spacer-xs);
  }
}
.action {
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
}
.checkbox {
  margin-bottom: var(--spacer-2xl);
}
.bottom {
  text-align: center;
  margin-bottom: var(--spacer-lg);
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight--semibold);
  font-family: var(--font-family--secondary);
  &__paragraph {
    color: var(--c-primary);
    margin: 0 0 var(--spacer-base) 0;
    @include for-desktop {
      margin: 0;
    }
  }
}
.thank-you {
  &__paragraph {
    &--bold {
      font-weight: var(--font-weight--semibold);
    }
  }
}
</style>
