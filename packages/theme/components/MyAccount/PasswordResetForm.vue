<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      id="password-reset-form"
      class="form"
      @submit.prevent="handleSubmit(submitForm)"
    >
      <div class="form__horizontal">
        <ValidationProvider
          rules="required|password"
          v-slot="{ errors }"
          class="form__element"
          vid="confirmation"
        >
          <SfInput
            type="password"
            data-cy="password-reset-input_currentPassword"
            v-model="form.currentPassword"
            name="currentPassword"
            label="Current Password"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div class="form__horizontal">
        <ValidationProvider
          rules="required|password"
          v-slot="{ errors }"
          class="form__element"
          vid="confirmation"
        >
          <SfInput
            type="password"
            data-cy="password-reset-input_newPassword"
            v-model="form.newPassword"
            name="newPassword"
            label="New Password"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          rules="required|password|confirmed:confirmation"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            type="password"
            data-cy="password-reset-input_repeatPassword"
            v-model="form.repeatPassword"
            name="repeatPassword"
            label="Repeat Password"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
       <SfButton class="form__button">
        {{ "Change password" }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, confirmed } from 'vee-validate/dist/rules';
import { useUser } from '@vue-storefront/orc-vsf';
import {
  SfInput,
  SfButton
} from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('confirmed', {
  ...confirmed,
  message: 'Passwords don\'t match'
});

export default defineComponent({
  name: 'PasswordResetForm',
  components: {
    SfInput,
    SfButton,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props, { emit }) {
    const { error: userError } = useUser();
    const { send: sendNotification } = useUiNotification();
    const form = ref({});

    const submitForm = async () => {
      const onComplete = async () => {
        if (userError.value.changePassword) {
          sendNotification({
            id: Symbol('user_change_password_error'),
            message: userError.value.changePassword?.message,
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'User Account'});
        } else {
          sendNotification({
            id: Symbol('user_change_password'),
            message: 'The user password was successfully updated!',
            type: 'success',
            icon: 'check',
            persist: false,
            title: 'User Account'
          });
        }
        form.value = {};
      };
      const onError = () => {
        if (userError.value.changePassword) {
          sendNotification({
            id: Symbol('user_change_password_error'),
            message: userError.value.changePassword.message,
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'User Account'});
        }
        form.value = {};
      };

      emit('submit', { form, onComplete, onError });
    };
    return {
      form,
      submitForm
    };
  }
});
</script>
<style lang='scss' scoped>
.form {
  &__element {
    display: block;
    margin-bottom: var(--spacer-base);
  }
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  &__button {
    display: block;
    margin-top: var(--spacer-lg);
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
