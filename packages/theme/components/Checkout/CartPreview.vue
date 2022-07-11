<template>
  <div>
    <div class="highlighted">
       <SfHeading
        :level="3"
        :title="$t('Order summary')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <SfProperty
        :name="$t('Products')"
        :value="totalItems"
        class="sf-property--full-width sf-property--large property"
      />

      <SfProperty
        :name="$t('Subtotal')"
        :value="$n(totals.subtotal, 'currency')"
        :class="['sf-property--full-width', 'sf-property--large property']"
      />

      <SfProperty
        v-if="isActiveShippingTaxable && isActiveShippingEstimate"
        :name="$t('Shipping')"
        :value="$n(cartGetters.getShippingPrice(cart), 'currency')"
        :class="['sf-property--full-width', 'sf-property--small property']"
      />

      <SfProperty
        v-for="(tax, i) in taxes"
        :key="i"
        :name="tax.displayName[locale]"
        :value="$n(tax.taxTotal, 'currency')"
        :class="['sf-property--full-width', 'sf-property--small property']"
      />

      <SfProperty
        v-if="!isActiveShippingTaxable && isActiveShippingEstimated"
        :name="$t('Shipping')"
        :value="$n(cartGetters.getShippingPrice(cart), 'currency')"
        :class="['sf-property--full-width', 'sf-property--small property']"
      />

      <SfProperty
        :name="$t('Total')"
        :value="$n(totals.total, 'currency')"
        class="sf-property--full-width sf-property--large property property-total"
      />

      <CartSaving class="cart-saving"/>

    </div>
    <div class="highlighted spaced coupons">
        <CouponCode class="cart-coupon" />
    </div>
    <div class="highlighted">
      <SfCharacteristic
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        class="characteristic"
      />
    </div>
  </div>
</template>

<script>
import { SfHeading, SfProperty, SfCharacteristic } from '@storefront-ui/vue';
import CartSaving from './CartSaving';
import CouponCode from './CouponCode';
import { computed, useRouter } from '@nuxtjs/composition-api';
import { useCart, cartGetters} from '@vue-storefront/orc-vsf';
const CHARACTERISTICS = [
  {
    title: 'Safety',
    description: 'It carefully packaged with a personal touch',
    icon: 'safety'
  },
  {
    title: 'Easy shipping',
    description: 'You’ll receive dispatch confirmation and an arrival date',
    icon: 'shipping'
  },
  {
    title: 'Fees',
    description: 'Additional fees may apply in case of oversized packages.',
    icon: 'info'
  }
];

export default {
  name: 'CartPreview',
  components: {
    SfHeading,
    SfProperty,
    SfCharacteristic,
    CartSaving,
    CouponCode
  },
  setup() {
    const { cart } = useCart();
    const router = useRouter();
    const { locale } = router.app.$i18n;
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const isActiveShippingTaxable = computed(() => cartGetters.isActiveShippingTaxable(cart.value));
    const isActiveShippingEstimated = computed(() => cartGetters.isActiveShippingEstimated(cart.value));
    const taxes = computed(() => cartGetters.getTaxes(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    return {
      cartGetters,
      cart,
      totalItems,
      totals,
      taxes,
      isActiveShippingTaxable,
      isActiveShippingEstimated,
      locale,
      characteristics: CHARACTERISTICS
    };
  }
};
</script>
<style lang="scss" scoped>
.spaced {
  margin: var(--spacer-xs) 0;
}

.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-xl) var(--spacer-xl);
  &.coupons {
   padding-bottom: var(--spacer-sm);
  }
}

.cart-saving {
  margin-left: -15px;
  margin-right: -15px;
}
.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer-xl);
}
.property {
  margin-bottom: var(--spacer-base);
}
.property-total {
  margin-top: var(--spacer-xl);
  padding-top: var(--spacer-lg);
  font-size: var(--font-size-xl);
  border-top: var(--c-white) 1px solid;
  --property-name-font-weight: var(--font-weight--semibold);
  --property-name-color: var(--c-text);
}

.characteristic {
  &:not(:last-child) {
    margin-bottom: var(--spacer-base);
  }
}
</style>
