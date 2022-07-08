<template>
  <div id="confirm-order">
    <div class="personal-details">
      <SfHeading
        title="Personal Details"
        :level="3"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <SfProperty
        name="First name"
        :value="personalDetails.firstName"
        class="sf-property"
      />
      <SfProperty
        name="Last name"
        :value="personalDetails.lastName"
        class="sf-property"
      />

      <SfProperty
        name="Email"
        :value="personalDetails.email"
        class="sf-property"
      />
    </div>
    <div class="grid">
    <div class="shipping">
      <SfHeading
        title="Shipping"
        :level="3"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <SfProperty
        name="Shipping method"
        :value="shipping.method"
        class="sf-property"
      />
      <SfProperty
        name="Shipping address"
        value="TODO"
        class="sf-property"
      >
      <template #value>
       <AddressPreview :address="shipping.address" />
      </template>

      </SfProperty>
    </div>
    <div class="payment">
      <SfHeading
        title="Payment"
        :level="3"
        class="sf-heading--left sf-heading--no-underline title"
      />

      <SfProperty
        name="Payment method"
        :value="payment.method"
        class="sf-property"
      />

      <SfProperty
        name="Billing address"
        class="sf-property">
        <template #value>
          <AddressPreview :address="payment.address" />
        </template>
      </SfProperty>

    </div>
    </div>
    <div v-if="totalItems">
      <div class="items" >
        <SfHeading
          :title="`Product items (${totalItems})`"
          :level="3"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <CartItemsTable />
      </div>

      <div class="summary smartphone-only">
        <div class="summary__content">
          <SfProperty
            name="Subtotal"
            :value="$n(totals.subtotal, 'currency')"
            class="sf-property--full-width property"
          />

          <SfDivider class="divider" />
          <SfProperty
            name="Total price"
            :value="$n(totals.total, 'currency')"
            class="sf-property--full-width property"
          />
        </div>
      </div>
      <div class="totals desktop-only">
        <SfProperty
          name="Subtotal"
          :value="$n(totals.subtotal, 'currency')"
          class="sf-property--full-width property property__subtotal"
        >
        </SfProperty>
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
        <SfDivider class="divider" />
        <SfProperty
          name="Total price"
          :value="$n(totals.total, 'currency')"
          class="sf-property--full-width sf-property--large property__total"
        >
        </SfProperty>
      </div>
      <div class="smartphone-only">
        <CartSaving class="cart-saving"/>
      </div>
      <div class="smartphone-only">
        <CouponCode class="cart-coupon" />
      </div>
      <div>
        <SfCheckbox v-e2e="'terms'" v-model="terms" name="terms" class="summary__terms">
          <template #label>
            <div class="sf-checkbox__label">
              {{ $t('I agree to') }} <SfLink href="#"> {{ $t('Terms and conditions') }}</SfLink>
            </div>
          </template>
        </SfCheckbox>
      </div>
      <div class="form">
          <div class="form__action">
            <SfButton
              class="sf-button color-secondary form__back-button"
              type="button"
              @click="goBack"
            >
              {{ $t('Go back') }}
            </SfButton>
            <SfButton
              :disabled="cartLoading || !isOrderReady || !terms"
              class="form__action-button"
              type="submit"
              @click="processOrder"
            >
              Submit Order
            </SfButton>
          </div>
        </div>
    </div>
     <div v-else class="empty-cart">
       <SfHeading
          title="Your cart is empty"
          :level="2"
          class="empty-cart__heading"
          description="Looks like you haven’t added any items to the bag yet. Start
          shopping to fill it in."
        />
    </div>
  </div>
</template>
<script>
import { onSSR } from '@vue-storefront/core';
import {
  SfHeading,
  SfButton,
  SfCheckbox,
  SfDivider,
  SfProperty,
  SfLink } from '@storefront-ui/vue';
import CartSaving from '../../components/Checkout/CartSaving';
import CouponCode from '../../components/Checkout/CouponCode';
import CartItemsTable from '../../components/Checkout/CartItemsTable';
import AddressPreview from '../../components/AddressPreview';
import { ref, computed, useRouter } from '@nuxtjs/composition-api';
import { useMakeOrder, useCart, cartGetters, orderGetters } from '@vue-storefront/orc-vsf';

export default {
  name: 'CartPreview',
  components: {
    CartItemsTable,
    SfButton,
    SfCheckbox,
    SfHeading,
    SfProperty,
    CartSaving,
    SfDivider,
    SfLink,
    AddressPreview,
    CouponCode
  },
  setup(props, context) {

    const { cart, load: loadCart, loading: cartLoading, setCart } = useCart();
    const { order, make } = useMakeOrder();
    const router = useRouter();
    const { locale } = router.app.$i18n;
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const isActiveShippingTaxable = computed(() => cartGetters.isActiveShippingTaxable(cart.value));
    const isActiveShippingEstimated = computed(() => cartGetters.isActiveShippingEstimated(cart.value));
    const taxes = computed(() => cartGetters.getTaxes(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const activeShipment = computed(() => cartGetters.getActiveShipment(cart.value));
    const activePayment = computed(() => cartGetters.getActivePayment(cart.value));

    const personalDetails = {
      firstName: cart.value?.customer?.firstName,
      lastName: cart.value?.customer?.lastName,
      email: cart.value?.customer?.email
    };

    const shipping = {
      method: activeShipment?.value?.fulfillmentMethod.displayName[locale],
      address: {
        ...activeShipment?.value.address
      }
    };

    const payment = {
      method: activePayment?.value?.paymentMethod?.displayName[locale],
      address: activePayment?.value?.billingAddress
    };

    const terms = ref(false);
    const isOrderReady = ref(false);

    const goBack = () => {
      router.push(context.root.localePath({ name: 'payment' }));
    };

    const processOrder = async () => {
      await make();
      const thankYouPath = { name: 'thank-you', query: { order: orderGetters.getId(order.value) }};
      router.push(context.root.localePath(thankYouPath));
      setCart(null);
    };

    onSSR(async () => {
      await loadCart();
    });

    return {
      terms,
      isOrderReady,
      goBack,
      personalDetails,
      shipping,
      payment,
      cartGetters,
      cart,
      totalItems,
      totals,
      taxes,
      isActiveShippingTaxable,
      isActiveShippingEstimated,
      locale,
      cartLoading,
      processOrder
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.grid {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}
.title {
  --heading-padding: var(--spacer-xl) 0 var(--spacer-base);
  --heading-title-font-weight: var(--font-weight--bold);
  @include for-desktop {
    --heading-title-font-size: var(--h3-font-size);
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-padding: var(--spacer-base) 0;
  }
}
.totals {
  &__terms {
    margin-top: var(--spacer-xl);
    --link-color: var(--c-link);
    --link-font-family: var(--font-family--primary);
    --link-font-weight: var(--font-weight--normal);
  }
  &__element:first-child {
    margin-bottom: var(--spacer-base);
  }
}
.property {
  margin: 0 0 var(--spacer-xs) 0;
  --property-name-font-weight: var(--font-weight--medium);
  --property-name-font-size: var(--font-size--base);
  --property-value-font-weight: var(--font-weight--bold);
  --property-value-font-size: var(--font-size--base);
  &__total {
    margin: 0 0 var(--spacer-xl) 0;
    --property-name-color: var(--c-text);
  }
  @include for-desktop {
    margin: 0 0 var(--spacer-sm) 0;
    &__subtotal {
      margin: var(--spacer-xl) 0 var(--spacer-base);
    }
    &__total {
      --property-name-font-weight: var(--font-weight--bold);
      --property-name-font-size: var(--h4-font-size);
      --property-value-font-weight: var(--font-weight--bold);
      --property-value-font-size: var(--h4-font-size);
      padding: var(--spacer-base) 0 0 0;
    }
  }
}
.divider {
  --divider-border-color: var(--c-primary);
  --divider-width: 100%;
  --divider-margin: 0 0 var(--spacer-base) 0;
}
.cart-coupon {
   margin: var(--spacer-sm) 0;
}
.summary {
  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--spacer-xl) 0;
  }
  &__terms {
    margin: 0 0 0 var(--spacer-xs);
  }
}
.content {
  margin: 0 0 var(--spacer-base) 0;
  color: var(--c-text);
  &__label {
    font-weight: var(--font-weight--normal);
  }
}
.form {
  margin-top: var(--spacer-base);
  --button-width: 100%;
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    --button-width: auto;
  }
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    &--secondary {
      @include for-desktop {
        order: -1;
        text-align: left;
      }
    }
    &--add-address {
      width: 100%;
      margin: 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
  &__back-button {
    margin: var(--spacer-xl) 0 var(--spacer-sm);
    &:hover {
      color:  var(--c-white);
    }
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}

.empty-cart {
  margin-top: var(--spacer-lg);
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__heading {
    padding: 0 var(--spacer-base);
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-size--xl);
    --heading-title-margin: 0 0 var(--spacer-sm) 0;
  }
}
</style>