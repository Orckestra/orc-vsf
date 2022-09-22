<template v-if="methods">
    <div class="payment-methods">
      <SfRadio
        v-e2e="'payment-method'"
        v-for="method in methods"
        :key="method.id"
        :label="th.getTranslation(method.displayName)"
        :value="method.id"
        :disabled="cartLoading || makeOrderLoading"
        :selected ="selectedMethod"
        name="spaymentMethod"
        class="form__radio payment-method"
        :class="{'payment-method-disabled' : disabledMethodsIds.includes(method.id) }"
        @change="selectMethod(methods.find(p => p.id === method.id))"
      >
        <div class="payment__label">
          {{ th.getTranslation(method.displayName) }}
        </div>
      </SfRadio>
    </div>
</template>

<script>
import { SfButton, SfRadio } from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import { useCart, cartGetters, useMakeOrder } from '@vue-storefront/orc-vsf';
import { useUiHelpers } from '~/composables';

export default {
  name: 'PaymentMethods',
  props: {
    methods: {
      type: Array,
      default: () => {
        null;
      }
    },
    disabledMethodsIds: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SfButton,
    SfRadio
  },
  setup() {
    const { cart, loading: cartLoading, updatePaymentMethod } = useCart();
    const { loading: makeOrderLoading } = useMakeOrder();

    const payment = computed(() => cartGetters.getActivePayment(cart.value));
    const selectedMethod = computed(() => payment.value?.paymentMethod?.id);
    const isCreditCard = computed(() => payment.value?.paymentMethod?.type === 'CreditCard');
    const th = useUiHelpers();

    const selectMethod = async (paymentMethod) => {
      await updatePaymentMethod({paymentMethod});
    };

    return {
      cartLoading,
      makeOrderLoading,
      selectedMethod,
      selectMethod,
      th,
      isCreditCard
    };
  }
};
</script>

<style lang="scss" scoped>
.payment-methods {
  border-bottom: solid 2px var(--c-light);
  padding: 0 0 var(--spacer-base) 0;
  margin-bottom: var(--spacer-lg);
  @include for-desktop {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacer-xl);
    padding: var(--spacer-xs) 0;
    width: 100%;
  }
}
.payment-method {
  --radio-container-align-items: center;
  --radio-container-padding: var(--spacer-base) var(--spacer-sm) 0;
  --ratio-content-margin: 0 0 0 var(--spacer-lg);
  --radio-background: transparent;
  color: var(--c-link);
  white-space: nowrap;
  ::v-deep .sf-image {
    width: 3.125rem;
  }
  @include for-desktop {
    --radio-container-padding: var(--spacer-sm);
  }
  &-disabled {
     display: none;
  }
}
</style>
