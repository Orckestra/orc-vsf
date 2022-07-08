<template>
  <div class="address-preview" v-if="address">
    <span v-if="address.addressName" class="sf-property__value">{{address.addressName}}</span>
    <span>{{`${address.firstName} ${address.lastName}`}}</span>
    <span>{{`${address.city}, ${address.line1 ? address.line1 : ''} ${address.line2 ? address.line2 : ''}`}}</span>
    <span>{{`${address.regionCode}, ${address.postalCode}`}}</span>
    <span>{{address.phoneNumber}}</span>
  </div>

</template>

<script>

export default {
  name: 'AddressPreview',
  props: {
    address: {
      type: Object,
      default: null
    }
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
