<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      class="form"
      @submit.prevent="handleSubmit(submitForm)"
    >
      <AddressForm :form="form" />
     
      <SfCheckbox
        v-model="form.isPreferredBilling"
        name="isPreferredBilling"
        label="Set as preferred billing address"
        class="form__element form__checkbox"
      />

      <div class="form__action-bar">
        <SfButton
          class="action-button color-light cancel-button sf-button"
          @click.prevent="cancelEdit"
        >
          {{ $t('Cancel') }}
        </SfButton>
        <SfButton
          class="action-button sf-button"
          :disabled="loading"
          >
          {{ $t(isNew ? 'Add address' : 'Update address') }}
        </SfButton>

      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';
import { SfButton, SfCheckbox } from '@storefront-ui/vue';
import { ValidationObserver } from 'vee-validate';
import { useUserAddresses, countriesGetters, useCountries } from '@vue-storefront/orc-vsf';
import AddressForm from '~/components/AddressForm';

export default {
  name: 'BillingAddressForm',
  components: {
    SfButton,
    SfCheckbox,
    AddressForm,
    ValidationObserver
  },
  props: {
    isNew: {
      type: Boolean,
      default: true
    },
    address: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const { error: userAddressError, loading } = useUserAddresses();
    const { send: sendNotification } = useUiNotification();
    const form = ref({
      addressName: '',
      firstName: '',
      lastName: '',
      line1: '',
      line2: '',
      city: '',
      regionCode: '',
      postalCode: '',
      countryCode: '',
      phoneNumber: '',
      isPreferredBilling: false
    });


    if (!props.isNew) {
      form.value = { ...props.address };
    }

    const submitForm = async () => {
      const onComplete = async () => {
        if (props.isNew) {
          if (userAddressError.value.addAddress) {
            sendNotification({
              id: Symbol('user_updated_error'),
              message: userAddressError.value.addAddress.message,
              type: 'danger',
              icon: 'error',
              persist: false,
              title: 'User Address'
            });
          } else {
            sendNotification({
              id: Symbol('user_updated'),
              message: 'The user address was successfully added!',
              type: 'success',
              icon: 'check',
              persist: false,
              title: 'User Address'
            });
          }
        } else if (userAddressError.value.updateAddress) {
          sendNotification({
            id: Symbol('user_updated_error'),
            message: userAddressError.value.updateAddress.message,
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'User Address'
          });
        } else {
          sendNotification({
            id: Symbol('user_updated'),
            message: 'The user address was successfully updated!',
            type: 'success',
            icon: 'check',
            persist: false,
            title: 'User Address'
          });
        }
      };

      const onError = (error) => {
        sendNotification({
          id: Symbol('user_updated_error'),
          message: error.message,
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'User Address'
        });
      };

      emit('submit', {
        form: form.value,
        onComplete,
        onError
      });
    };

    const cancelEdit = () => emit('cancel');

    return {
      loading,
      form,
      submitForm,
      cancelEdit
    };
  }
};
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
  &__action-bar {
    display: flex;
    flex-direction: row;

    button {
      &:not(:first-child) {
        margin-left: var(--spacer-xl);
      }
    }
  }
}
</style>
