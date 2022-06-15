<template>
<!--  <SfShipping
    :shippingMethods='[{"isOpen":false,"price":"Free","delivery":"Delivery from 3 to 7 business days","label":"Pickup in the store","value":"store","description":"Novelty! From now on you have the option of picking up an order in the selected InPack parceled. Just remember that in the case of orders paid on delivery, only the card payment will be accepted."},{"isOpen":false,"price":"$9.90","delivery":"Delivery from 4 to 6 business days","label":"Delivery to home","value":"home","description":"Novelty! From now on you have the option of picking up an order in the selected InPack parceled. Just remember that in the case of orders paid on delivery, only the card payment will be accepted."},{"isOpen":false,"price":"$9.90","delivery":"Delivery from 4 to 6 business days","label":"Paczkomaty InPost","value":"inpost","description":"Novelty! From now on you have the option of picking up an order in the selected InPack parceled. Just remember that in the case of orders paid on delivery, only the card payment will be accepted."},{"isOpen":false,"price":"$11.00","delivery":"Delivery within 48 hours","label":"48 hours coffee","value":"coffee","description":"Novelty! From now on you have the option of picking up an order in the selected InPack parceled. Just remember that in the case of orders paid on delivery, only the card payment will be accepted."},{"isOpen":false,"price":"$14.00","delivery":"Delivery within 24 hours","label":"Urgent 24h","value":"urgent","description":"Novelty! From now on you have the option of picking up an order in the selected InPack parceled. Just remember that in the case of orders paid on delivery, only the card payment will be accepted."}]'
    headingTitle="Shipping"
    :headingTitleLevel="2"
    :inputsLabels='["First name","Last name","Street name","City","State/Province","Zip-code","Phone number"]'
    selectLabel="Country"
    :countries='["Austria","Azerbaijan","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Georgia","Germany","Greece","Hungary","Iceland","Ireland","Italy","Kosovo","Latvia","Liechtenstein","Lithuania","Luxembourg","Macedonia","Malta","Moldova","Monaco","Montenegro","The Netherlands","Norway","Poland","Portugal","Romania","Russia","San Marino","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Turkey","Ukraine","United Kingdom","Vatican City"]'
    methodsHeadingTitle="Shipping method"
    :methodsHeadingTitleLevel="2"
  />-->
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form
      class="form"
      @submit.prevent="handleSubmit(submitForm)"
    >
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
              v-for="{isoCode, name} in countriesGetters.getRegions(countries, form.countryCode)"
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
          >
          {{ $t(isNew ? 'Add the address' : 'Update the address') }}
        </SfButton>
        <SfButton
          v-if='!isNew'
          class="action-button color-secondary cancel-button sf-button"
          @click="cancelEdit"
        >
          {{ $t('Cancel') }}
        </SfButton>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';
import { SfButton, SfInput, SfSelect, SfCheckbox } from '@storefront-ui/vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { useCountries } from '@vue-storefront/orc-vsf/src/useCountries';
import { countriesGetters } from '@vue-storefront/orc-vsf/src/getters/countriesGetters';
import { useUserShipping } from '@vue-storefront/orc-vsf';

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
    const { error: userAddressError } = useUserShipping();

    const { send: sendNotification } = useUiNotification();
    const form = ref({
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
      countriesGetters,
      countries: countries.value,
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
