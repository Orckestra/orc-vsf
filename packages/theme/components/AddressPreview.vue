<template>
  <div class="address-preview" v-if="address">
    <span v-if="address.addressName" class="sf-property__value">{{address.addressName}}</span>
    <span>{{`${address.firstName} ${address.lastName}`}}</span>
    <span>{{`${address.city}, ${address.line1 ? address.line1 : ''} ${address.line2 ? address.line2 : ''}`}}</span>
    <span>{{`${countriesGetters.getCountryRegionName(countries, address.countryCode, address.regionCode)}, ${address.postalCode}`}}</span>
    <span>{{`${countriesGetters.getCountryName(countries, address.countryCode)}`}}</span>
    <span>{{address.phoneNumber}}</span>
  </div>

</template>

<script>
import { countriesGetters, useCountries } from '@vue-storefront/orc-vsf';

export default {
  name: 'AddressPreview',
  props: {
    address: {
      type: Object,
      default: null
    }
  },
  setup() {
    const { countries } = useCountries();

    return {
      countries,
      countriesGetters
    };
  }
};
</script>
<style lang="scss" scoped>
.address-preview {
  span {
    display: block;
  }
}
</style>
