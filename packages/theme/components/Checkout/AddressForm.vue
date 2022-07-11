<template>
  <div class="form">
    <ValidationProvider
      v-if="showName"
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
      rules="max:6"
      class="form__element"
    >
      <SfInput
        v-model="form.line2"
        name="line2"
        :label="'House/Apartment number'"
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
  </div>
</template>

<script>
import { SfButton, SfInput, SfSelect, SfCheckbox } from '@storefront-ui/vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { countriesGetters, useCountries } from '@vue-storefront/orc-vsf';

export default {
  name: 'AddressForm',
  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    form: {
      type: Object,
      default: () => ({})
    },
    showName: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { countries } = useCountries();
    const getRegions = (country) => countriesGetters.getRegions(countries.value, country);

    return {
      getRegions,
      countries
    };
  }
};
</script>
<style lang='scss' scoped>
.form {
  &__element {
    flex: 1 0 100%;
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
    flex: 1 0 100%;
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
