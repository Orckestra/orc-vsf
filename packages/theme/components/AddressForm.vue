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
        :label="$t('Address Name')"
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
          :label="$t('First Name')"
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
          :label="$t('Last Name')"
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
        :label="$t('Street Name')"
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
        :label="$t('House/Apartment number')"
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
       <SfComponentSelect
          v-model="form.countryCode"
          name="countryCode"
          @change="form.regionCode = ''"
          :label="$t('Country')"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
          class="
            sf-component-select--underlined
            form__select
            form__element--half
            form__element--half-even">
          <SfComponentSelectOption
            v-for="{isoCode, name} in countries"
            :key="isoCode"
            :value="isoCode">
              {{ name || isoCode }}
          </SfComponentSelectOption>
        </SfComponentSelect>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|min:2|max:36"
        class="form__element"
      >
        <SfComponentSelect
          v-model="form.regionCode"
          name="regionCode"
          :label="$t('State/Province')"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
          class="
            sf-component-select--underlined
            form__select
            form__element--half
            form__element--half-even">
            <SfComponentSelectOption
              v-for="{isoCode, name} in getRegions(form.countryCode)"
              :key="isoCode"
              :value="isoCode"
                >
              {{ name || isoCode }}
            </SfComponentSelectOption>
        </SfComponentSelect>
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
          :label="$t('City')"
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
          :label="$t('Zip-code')"
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
        :label="$t('Phone number')"
        required
        :valid="!errors[0]"
        :error-message="errors[0]"
      />
    </ValidationProvider>
  </div>
</template>

<script>
import { SfButton, SfInput, SfSelect, SfComponentSelect, SfCheckbox } from '@storefront-ui/vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { countriesGetters, useCountries } from 'orc-vsf';

export default {
  name: 'AddressForm',
  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    SfComponentSelect,
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
