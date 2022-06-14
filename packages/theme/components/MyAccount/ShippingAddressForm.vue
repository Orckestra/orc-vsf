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
            v-model="form.lastname"
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
          v-model="form.streetName"
          name="streetName"
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
          v-model="form.houseNumber"
          name="houseNumber"
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
            v-model="form.state"
            name="state"
            :label="'State/Province'"
            class=" form__select  sf-select--underlined"
            required
            :disabled="!form.country"
            :valid="!errors[0]"
            :error-message="errors[0]"
          >
            <SfSelectOption
              v-for="{isoCode, name} in countriesGetters.getRegions(countries, form.country)"
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
            v-model="form.zipCode"
            name="zipCode"
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
            v-model="form.country"
            name="country"
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
        v-model="form.default"
        name="default"
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
import { SfButton, SfInput, SfModal, SfSelect, SfCheckbox } from '@storefront-ui/vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { useCountries } from '@vue-storefront/orc-vsf/src/useCountries';
import { countriesGetters } from '@vue-storefront/orc-vsf/src/getters/countriesGetters';

export default {
  name: 'ShippingAddressForm',
  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    // SfModal,
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

    // const { user, error: userError } = useUser();
  //  const currentPassword = ref('');
    //   const requirePassword = ref(false);
    //    const resetForm = () => ({
    //      firstname: userGetters.getFirstName(user.value),
    //      lastname: userGetters.getLastName(user.value),
    //      email: userGetters.getEmailAddress(user.value)
    //    });
    const { send: sendNotification } = useUiNotification();
    const form = ref({
      firstname: '',
      lastname: '',
      streetName: '',
      houseNumber: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phoneNumber: '',
      default: false
    });

    const submitForm = (resetValidationFn) => async () => {
      // const onComplete = async () => {
      //   form.value = resetForm();
      //   requirePassword.value = false;
      //   currentPassword.value = '';
      //   if (userError.value.updateUser) {
      //     sendNotification({
      //       id: Symbol('user_updated_error'),
      //       message: userError.value.updateUser.message,
      //       type: 'danger',
      //       icon: 'error',
      //       persist: false,
      //       title: 'User Account'});
      //   } else {
      //     sendNotification({
      //       id: Symbol('user_updated'),
      //       message: 'The user account data was successfully updated!',
      //       type: 'success',
      //       icon: 'check',
      //       persist: false,
      //       title: 'User Account'
      //     });
      //   }
      //   resetValidationFn();
      // };
      //
      // const onError = () => {
      //   form.value = resetForm();
      //   requirePassword.value = false;
      //   currentPassword.value = '';
      //   if (userError.value.updateUser) {
      //     sendNotification({
      //       id: Symbol('user_updated_error'),
      //       message: userError.value.updateUser.message,
      //       type: 'danger',
      //       icon: 'error',
      //       persist: false,
      //       title: 'User Account'});
      //   }
      // };

      emit('submit', {
        form
        // onComplete, onError
      });
    };

    const cancelEdit = () => emit('cancel');

    return {
      //   requirePassword,
    //  currentPassword,
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
