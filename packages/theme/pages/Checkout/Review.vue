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
        name="Shipping type"
        :value="shipping.type"
        class="sf-property"
      />
      <SfProperty
        :name="`${shipping.type} address`"
        class="sf-property"
      >
      <template #value>
       <AddressPreview :address="shipping.address" />
      </template>

      </SfProperty>
    </div>
    <div class="billing">
      <SfHeading
        title="Billing"
        :level="3"
        class="sf-heading--left sf-heading--no-underline title"
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
          :name="th.getTranslation(tax.displayName)"
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
      <div>
        <CartSaving class="cart-saving"/>
      </div>
      <div class="smartphone-only">
        <CouponCode class="cart-coupon" />
      </div>
      <div class="payment">
        <SfHeading
          title="Payment"
          :level="3"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <VsfPaymentProvider />
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
              :disabled="makeOrderLoading || cartLoading"
            >
              {{ $t('Go back') }}
            </SfButton>
            <SfButton
              :disabled="makeOrderLoading || cartLoading || !isOrderReady || !terms || unavailableProducts.length"
              class="form__action-button"
              type="submit"
              @click="processOrder"
            >
              Submit Order
            </SfButton>
          </div>
          <div v-if="unavailableProducts.length">
            <p class="message">
              {{ $t('Your cart contains unavailable products. Please review the cart or click') }}
              <SfLink href="#" @click="removeUnavailable">{{ $t('Clear the cart') }}</SfLink>
              {{ $t(' to remove unavailable items automatically.') }}
            </p>
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
import { useUiHelpers } from '~/composables';
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
import { useUiNotification } from '~/composables';

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
    CouponCode,
    VsfPaymentProvider: () => import('~/components/Checkout/VsfPaymentProvider')
  },
  setup(props, context) {
    const th = useUiHelpers();
    const { send: sendNotification } = useUiNotification();
    const { cart, update, load: loadCart, loading: cartLoading, setCart, error } = useCart();
    const { order, make, loading: makeOrderLoading, error: orderError } = useMakeOrder();
    const router = useRouter();
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const isActiveShippingTaxable = computed(() => cartGetters.isActiveShippingTaxable(cart.value));
    const isActiveShippingEstimated = computed(() => cartGetters.isActiveShippingEstimated(cart.value));
    const taxes = computed(() => cartGetters.getTaxes(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const activeShipment = computed(() => cartGetters.getActiveShipment(cart.value));
    const activePayment = computed(() => cartGetters.getActivePayment(cart.value));
    const isPaymentMethod = computed(() => Boolean(activePayment.value.paymentMethod));
    const unavailableProducts = computed(() => cartGetters.getUnavailableItems(cart.value));

    const personalDetails = computed(() => ({
      firstName: cart.value?.customer?.firstName,
      lastName: cart.value?.customer?.lastName,
      email: cart.value?.customer?.email
    }));

    const shipping = computed(() => ({
      method: th.getTranslation(activeShipment?.value?.fulfillmentMethod?.displayName, activeShipment?.value?.fulfillmentMethod?.name),
      type: activeShipment?.value?.fulfillmentMethod?.fulfillmentMethodType,
      address: {
        ...activeShipment?.value?.address
      }
    }));

    const payment = computed(() => ({
      method: th.getTranslation(activePayment?.value?.paymentMethod?.displayName),
      address: activePayment?.value?.billingAddress
    }));

    const terms = ref(false);
    const isOrderReady = computed(() => cartGetters.isReadyForOrder(cart.value));

    const goBack = () => {
      router.push(context.root.localePath({ name: 'billing' }));
    };

    const processOrder = async () => {
      await make();
      if (orderError.value.make) {
        console.log(orderError.value.make);
        sendNotification({
          id: Symbol('complete-order_error'),
          message: 'Cannot complete your order. Please check your payment and address informations, and try again.',
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'Checkout process'
        });
      } else {
        const thankYouPath = { name: 'thank-you', query: { order: orderGetters.getId(order.value) }};
        router.push(context.root.localePath(thankYouPath));
        setCart(null);
        loadCart();
      }
    };

    const removeUnavailable = async () => {
      const filteredShipments = cart.value.shipments.map((el) => {
        if (el.lineItems.length) {
          el.lineItems = el.lineItems.filter(item => !unavailableProducts.value.includes(item));
          return el;
        }
      });
      const updatedCart = {
        ...cart.value,
        shipments: filteredShipments
      };

      if (!cart.value.shipments?.length) return;
      await update({ cart: updatedCart });

      if (error.value.update) {
        sendNotification({
          id: Symbol('cart_updated_error'),
          message: error.value.update.message,
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'Checkout process'
        });
      }
    };

    onSSR(async () => {
      await loadCart();
    });

    return {
      terms,
      isPaymentMethod,
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
      th,
      cartLoading,
      makeOrderLoading,
      processOrder,
      unavailableProducts,
      removeUnavailable
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
.cart-saving {
   margin: 0 0 var(--spacer-lg) 0;
}
.summary {
  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--spacer-xl) 0;
  }
  &__terms {
    margin: var(--spacer-lg) 0 0 var(--spacer-xs);
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
