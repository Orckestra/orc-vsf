<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form
      class="form"
      @submit.prevent="handleSubmit(submitForm)"
    >
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|min:2|max:36"
        class="form__element"
      >
        <SfInput
          v-model="form.addressName"
          name="addressName"
          :label="'Address Name'"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|max:36"
          class="form__element"
        >
          <SfInput
            v-model="form.firstName"
            name="firstName"
            :label="'First Name'"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|max:36"
          class="form__element"
        >
          <SfInput
            v-model="form.lastName"
            name="lastName"
            :label="'Last Name'"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|min:2|max:36"
        class="form__element"
      >
        <SfInput
          v-model="form.line1"
          name="line1"
          :label="'Street Name'"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|max:6"
        class="form__element"
      >
        <SfInput
          v-model="form.line2"
          name="line2"
          :label="'House/Apartment number'"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          class="form__element"
        >
          <SfSelect
            v-model="form.countryCode"
            name="countryCode"
            :label="'Country'"
            class=" form__select  sf-select--underlined"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          >
            <SfSelectOption
              v-for="{isoCode, name} in countries"
              :key="isoCode"
              :value="isoCode"
            >
              {{ name || isoCode }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|max:36"
          class="form__element"
        >
          <SfSelect
            v-model="form.regionCode"
            name="regionCode"
            :label="'State/Province'"
            class=" form__select  sf-select--underlined"
            required
            :disabled="!form.countryCode"
            :valid="!errors[0]"
            :error-message="errors[0]"
          >
            <SfSelectOption
              v-for="{isoCode, name} in getRegions(form.countryCode)"
              :key="isoCode"
              :value="isoCode"
            >
              {{ name || isoCode }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
      </div>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|max:36"
          class="form__element"
        >
          <SfInput
            v-model="form.city"
            name="city"
            :label="'City'"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:4|max:8"
          class="form__element"
        >
          <SfInput
            v-model="form.postalCode"
            name="postalCode"
            :label="'Zip-code'"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|min:8|max:10"
        class="form__element"
      >
        <SfInput
          v-model="form.phoneNumber"
          name="phoneNumber"
          :label="'Phone number'"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>

      <SfCheckbox
        v-model="form.isPreferredShipping"
        name="isPreferredShipping"
        label="Set as default"
        class="form__element form__checkbox"
      />

      <div class="form__action-bar">
        <SfButton
          class="action-button sf-button"
          :disabled="loading"
          >
          {{ $t(isNew ? 'Add the address' : 'Update the address') }}
        </SfButton>
        <SfButton
          class="action-button color-secondary cancel-button sf-button"
          @click.prevent="cancelEdit"
        >
          {{ $t('Cancel') }}
        </SfButton>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';
import { SfButton, SfInput, SfSelect, SfCheckbox } from '@storefront-ui/vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { useUserAddresses, countriesGetters, useCountries } from '@vue-storefront/orc-vsf';

export default {
  name: 'ShippingAddressForm',
  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    ValidationProvider,
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
    const { countries } = useCountries();
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
      isPreferredShipping: false
    });

    const getRegions = (country) => countriesGetters.getRegions(countries.value, country);

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
      getRegions,
      countries,
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
