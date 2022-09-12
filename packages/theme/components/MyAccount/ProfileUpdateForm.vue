<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form
      class="form"
      @submit.prevent="handleSubmit(submitForm(reset))"
    >
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|max:36"
          class="form__element"
        >
          <SfInput
            v-model="form.firstname"
            name="firstName"
            :label="$t('First Name')"
            required
            :valid="!errors[0]"
            :error-message="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|max:36"
          class="form__element"
        >
          <SfInput
            v-model="form.lastname"
            name="lastName"
            :label="$t('Last Name')"
            required
            :valid="!errors[0]"
            :error-message="$t(errors[0])"
          />
        </ValidationProvider>
      </div>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|email"
        class="form__element"
      >
        <SfInput
          v-model="form.email"
          type="email"
          name="email"
          :label="$t('Email')"
          required
          :valid="!errors[0]"
          :error-message="$t(errors[0])"
        />
      </ValidationProvider>
      <SfButton class="form__button">
        {{ $t('Update personal data') }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { email, min, max } from 'vee-validate/dist/rules';
import { useUser, userGetters } from '@vue-storefront/orc-vsf';
import {
  SfInput,
  SfButton,
  SfModal
} from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

extend('email', {
  ...email,
  message: 'The email field must be a valid email'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('max', {
  ...max,
  message: 'The field should have not more then {length} characters'
});

export default defineComponent({
  name: 'ProfileUpdateForm',
  components: {
    SfInput,
    SfButton,
    SfModal,
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
  emits: ['submit'],
  setup(props, { emit }) {
    const { user, error: userError } = useUser();
    const requirePassword = ref(false);
    const resetForm = () => ({
      firstname: userGetters.getFirstName(user.value),
      lastname: userGetters.getLastName(user.value),
      email: userGetters.getEmailAddress(user.value)
    });
    const { send: sendNotification } = useUiNotification();
    const form = ref(resetForm());

    const submitForm = (resetValidationFn) => async () => {
      const onComplete = async () => {
        form.value = resetForm();
        requirePassword.value = false;
        if (userError.value.updateUser) {
          sendNotification({
            id: Symbol('user_updated_error'),
            message: userError.value.updateUser.message,
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'User Account'});
        } else {
          sendNotification({
            id: Symbol('user_updated'),
            message: 'The user account data was successfully updated!',
            type: 'success',
            icon: 'check',
            persist: false,
            title: 'User Account'
          });
        }
        resetValidationFn();
      };

      const onError = () => {
        form.value = resetForm();
        requirePassword.value = false;
        if (userError.value.updateUser) {
          sendNotification({
            id: Symbol('user_updated_error'),
            message: userError.value.updateUser.message,
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'User Account'});
        }
      };

      emit('submit', { form, onComplete, onError });
    };

    return {
      requirePassword,
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
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
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
        margin-right: var(--spacer-2xl);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
