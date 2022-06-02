<template>
  <div id="reset-password">
    <SfHeading
      :title="$t('Reset Password')"
      :level="3"
      class="heading sf-heading--no-underline"
    />
    <div v-if="!isPasswordChanged">
      <ValidationObserver
        v-slot="{ handleSubmit }"
        key="log-in"
      >
        <form
          class="form"
          @submit.prevent="handleSubmit(setNewPassword)"
        >
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|password"
          >
            <SfInput
              v-model="form.password"
              v-e2e="'reset-password-modal-password'"
              :valid="!errors[0]"
              :error-message="$t(errors[0])"
              :label="$t('Password')"
              name="password"
              type="password"
              class="form__element"
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
          >
            <SfInput
              v-model="form.repeatPassword"
              v-e2e="'reset-password-modal-password-repeat'"
              :valid="!errors[0]"
              :error-message="$t(errors[0])"
              :label="$t('Repeat Password')"
              name="repeat-password"
              type="password"
              class="form__element"
            />
          </ValidationProvider>
          <div v-if="passwordMatchError || forgotPasswordError.setNew">
            {{ passwordMatchError || forgotPasswordError.setNew.message }}
          </div>
          <SfButton
            v-e2e="'reset-password-modal-submit'"
            type="submit"
            class="sf-button--full-width form__button"
            :disabled="forgotPasswordLoading"
          >
            <SfLoader
              :class="{ loader: forgotPasswordLoading }"
              :loading="forgotPasswordLoading"
            >
              <div>{{ $t('Save Password') }}</div>
            </SfLoader>
          </SfButton>
        </form>
      </ValidationObserver>
    </div>
    <div v-else>
      <p>{{ $t('Password Changed') }}</p>
      <SfButton
        class="sf-button"
        link="/"
      >
        {{ $t('Back to home') }}
      </SfButton>
    </div>
  </div>
</template>
<script>
import {
  SfButton,
  SfLoader,
  SfInput,
  SfHeading
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  defineComponent,
  useContext
} from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, password } from 'vee-validate/dist/rules';
import { useConfiguration, configurationGetters, forgotPasswordGetters, useForgotPassword } from '@vue-storefront/orc-vsf';

extend('required', {
  ...required,
  message: 'This field is required'
});

export default defineComponent({
  name: 'ResetPassword',
  components: {
    SfButton,
    SfHeading,
    SfLoader,
    SfInput,
    ValidationProvider,
    ValidationObserver
  },
  middleware({ redirect, route }) {
    if (!route.query.ticket) {
      return redirect('/');
    }
  },
  setup(props, context) {
    const { result: forgotPasswordResult, setNew, error: forgotPasswordError, loading: forgotPasswordLoading } = useForgotPassword();
    const passwordMatchError = ref(false);
    const form = ref({});
    const { response: configuration } = useConfiguration();
    const isPasswordChanged = computed(() => forgotPasswordGetters.isPasswordChanged(forgotPasswordResult.value));
    const { ticket } = context.root.$route.query;    
    extend('password', {
      ...password,
      validate(value) {
        const minRequiredPasswordLength = configurationGetters.getMinRequiredPasswordLength(configuration.value);
        const minRequiredNonAlphanumericCharacters = configurationGetters.getMinRequiredNonAlphanumericCharacters(configuration.value);
        return new RegExp(`^(?=.*?[~!@#$%^&*()--+={}[]|\\:;"'<>,.?]{${minRequiredNonAlphanumericCharacters}}).{${minRequiredPasswordLength},}$`).test(value);
      },
      message: 'Your password must have a minimum 6 characters including at least 1 special character'
    });

    const setNewPassword = async () => {
      passwordMatchError.value = false;
      if (form.value.password !== form.value.repeatPassword) {
        passwordMatchError.value = 'Passwords do not match';
        return;
      }
      await setNew({
        tokenValue: ticket,
        newPassword: form.value.password
      });
    };

    return {
      form,
      setNewPassword,
      forgotPasswordLoading,
      forgotPasswordError,
      passwordMatchError,
      forgotPasswordResult,
      isPasswordChanged
    };
  }
});
</script>

<style lang="scss" scoped>
#reset-password {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 0 var(--spacer-sm);
  margin: var(--spacer-xl) 0;
  @include for-desktop {
    max-width: 77.5rem;
  }
}

.form {
  margin-top: var(--spacer-sm);
  min-width: 350px;
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
  }
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
</style>
