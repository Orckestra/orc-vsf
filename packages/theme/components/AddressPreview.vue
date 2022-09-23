<template>
  <div class="address-preview" v-if="address">
    <span v-if="address.addressName && showAddressName" class="sf-property__value address-preview-name">{{address.addressName}}</span>
    <span v-if="address.firstName && showName">{{`${address.firstName} ${address.lastName ? address.lastName : ''}`}}</span>
    <span v-if="address.city">{{`${address.city}, ${address.line1 ? address.line1 : ''} ${address.line2 ? address.line2 : ''}`}}</span>
    <span v-if="address.regionCode">{{`${countriesGetters.getCountryRegionName(countries, address.countryCode, address.regionCode)}, ${address.postalCode}`}}</span>
    <span v-if="address.countryCode">{{`${countriesGetters.getCountryName(countries, address.countryCode)}`}}</span>
    <span v-if="address.phoneNumber && showPhone">{{address.phoneNumber}}</span>
  </div>
</template>

<script>
import { countriesGetters, useCountries } from 'orc-vsf';

export default {
  name: 'AddressPreview',
  props: {
    address: {
      type: Object,
      default: null
    },
    showAddressName: {
      type: Boolean,
      default: true
    },
    showName: {
      type: Boolean,
      default: true
    },
    showPhone: {
      type: Boolean,
      default: true
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
  margin-bottom: var(--spacer-xs);
  span {
    display: block;
  }
  &-name {
    margin-bottom: var(--spacer-xs);
  }
}
</style>
