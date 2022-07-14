<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <div class="sf-personal-details">
      <slot name="heading" v-bind="{ headingTitle, headingTitleLevel }">
        <SfHeading
          :title="headingTitle"
          :level="headingTitleLevel"
          class="sf-heading--left sf-heading--no-underline title"
        />
      </slot>
      <form @submit.prevent="handleSubmit(handleFormSubmit)">
        <div class="form">
          <slot name="form">
            <SfInput
              v-model="form.firstName"
              label="First name"
              name="firstName"
              class="form__element form__element--half"
              required
            />
            <SfInput
              v-model="form.lastName"
              label="Last name"
              name="lastName"
              class="form__element form__element--half form__element--half-even"
              required
            />
            <SfInput
              v-model="form.email"
              label="Your email"
              name="email"
              class="form__element"
              required
            />
            <slot
              v-if='!isAuthenticated'
              name="create-account"
            >
              <SfCheckbox
                v-model="form.createAccount"
                name="createAccount"
                label="I want to create an account"
                class="form__checkbox"
                data-testid="create-account-checkbox"
              />
              <transition name="sf-fade">
                <ValidationProvider
                  v-if="form.createAccount"
                  v-slot="{ errors }"
                  rules="required|password"
                  class="form__element"
                >
                  <SfInput
                    v-model="form.password"
                    :has-show-password="true"
                    type="password"
                    label="Create Password"
                    required
                    data-testid="create-password-input"
                    :valid="!errors[0]"
                    :error-message="$t(errors[0])"
                  />
                </ValidationProvider>
              </transition>
            </slot>
          </slot>
        </div>
        <div class="form">
          <div class="form__action">
            <SfButton
              :disabled="userLoading || cartLoading"
              v-if='!isAuthenticated'
              class="form__action-button--secondary color-secondary"
              @click.prevent="toggleLoginModal"
            >{{ "Log into your account" }}</SfButton>
            <SfButton
              class="form__action-button"
              type="submit"
              :disabled="userLoading || cartLoading"
            >
              {{ $t('Go to shipping') }}
            </SfButton>
          </div>
        </div>
      </form>
    </div>
  </ValidationObserver>
</template>

<script>
import {
  SfInput,
  SfCheckbox,
  SfButton,
  SfHeading,
  SfCharacteristic
} from '@storefront-ui/vue';
import { computed, ref, useRouter, watch } from '@nuxtjs/composition-api';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { configurationGetters, useCart, useConfiguration, useUser, cartGetters } from '@vue-storefront/orc-vsf';
import { useUiState, useUiNotification } from '~/composables';
export default {
  name: 'PersonalDetails',
  components: {
    SfInput,
    SfCheckbox,
    SfButton,
    SfHeading,
    SfCharacteristic,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    headingTitle: {
      type: String,
      default: 'Personal details'
    },
    headingTitleLevel: {
      type: Number,
      default: 2
    }
  },
  setup (props, context) {
    const router = useRouter();
    const { isAuthenticated, register, error: userError, loading: userLoading } = useUser();
    const { cart, update, error, loading: cartLoading } = useCart();
    const { toggleLoginModal } = useUiState();
    const { send: sendNotification } = useUiNotification();

    const { response: configuration } = useConfiguration();
    extend('password', {
      validate(value) {
        const minRequiredPasswordLength = configurationGetters.getMinRequiredPasswordLength(configuration.value);
        const minRequiredNonAlphanumericCharacters = configurationGetters.getMinRequiredNonAlphanumericCharacters(configuration.value);
        return new RegExp(`^(?=.*?[~!@#$%^&*()--+={}[]|\\:;"'<>,.?]{${minRequiredNonAlphanumericCharacters}}).{${minRequiredPasswordLength},}$`).test(value);
      },
      message: 'Your password must have a minimum 6 characters including at least 1 special character'
    });

    const customer = computed(() => cartGetters.getCustomer(cart.value));

    const resetForm = () => ({
      firstName: customer.value?.firstName,
      lastName: customer.value?.lastName,
      email: customer.value?.email,
      password: '',
      createAccount: false
    });

    const form = ref(resetForm());

    watch(cart, () => {
      if (cart.value) {
        form.value = resetForm();
      }
    });

    const handleFormSubmit = async () => {
      const updatedCart = {
        ...cart.value,
        customer: {
          ...customer.value,
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          email: form.value.email
        }
      };

      const { createAccount, ...updatedUser } = form.value;

      if (createAccount) {
        await register({ user: updatedUser });

        if (userError.value.register) {
          sendNotification({
            id: Symbol('user_updated_error'),
            message: userError.value.register.message,
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'Checkout process'
          });
          return;
        }
      }

      await update({ cart: updatedCart });

      if (error.value.update) {
        sendNotification({
          id: Symbol('user_updated_error'),
          message: error.value.update.message,
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'Checkout process'
        });
      } else {
        router.push(context.root.localePath({ name: 'shipping' }));
      }
    };

    return {
      isAuthenticated,
      form,
      router,
      handleFormSubmit,
      toggleLoginModal,
      userLoading,
      cartLoading
    };
  }
};
</script>
<style lang="scss" scoped>
.sf-personal-details {
  .title {
    --heading-padding: var(--spacer-xl) 0 var(--spacer-base);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-title-font-size: var(--h3-font-size);
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      --heading-padding: var(--spacer-xl) 0;
    }
  }
  .form {
    &__element {
      --input-padding: var(--spacer-sm) 0 var(--spacer-2xs) 0;
      margin: 0 0 var(--spacer-base) 0;
    }
    &__checkbox {
      margin: var(--spacer-base) 0 var(--spacer-xl);
      --checkbox-font-family: var(--font-family--primary);
      --checkbox-font-size: var(--font-size--base);
    }
    &__action {
      @include for-desktop {
        flex: 0 0 100%;
        display: flex;
      }
    }
    &__action-button {
      &--secondary {
        margin: var(--spacer-xl) var(--spacer-sm) var(--spacer-sm) 0;
        &:hover {
          color:  var(--c-white);
        }
        @include for-desktop {
          margin: 0 var(--spacer-xl) 0 0 ;
        }
      }
    }
    @include for-desktop {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      &__element {
        margin: 0 0 var(--spacer-base) 0;
        flex: 0 0 100%;
        &--half {
          flex: 1 1 50%;
          &-even {
            padding: 0 0 0 var(--spacer-base);
          }
        }
      }
      &__checkbox {
        margin: var(--spacer-lg) 0 var(--spacer-xl);
      }
    }
  }
}
</style>
