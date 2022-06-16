<template>
  <div name="shipping-details">
    <p class="shipping__address">
      <span class="shipping__client-name">{{ address.firstName }} {{ address.lastName }}</span><br />
      {{ address.line1 }} {{ address.line2 }} {{address.city}} {{address.regionCode}} {{address.postalCode}}
    </p>
    <p class="shipping__address">
      {{ address.phoneNumber }}
    </p>
    <p v-if='address.isPreferredShipping' class="shipping__preferred">
      (preferred shipping address)
    </p>
  </div>
</template>

<script>
export default {
  name: 'UserShippingAddress',
  props: {
    address: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style lang='scss' scoped>
  .shipping {
    &__preferred {
      color: var(--c-light-darken);
      margin: 0;
      p {
        margin: 0;
      }
    }
  }
</style>
