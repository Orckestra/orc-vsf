<template>
<SfLoader :loading="loadingCreditCartMethods || loadingOnSiteMethods">
  <div>
    <div class="payment-methods">
      <SfRadio
        v-e2e="'payment-method'"
        v-for="method in methods"
        :key="method.id"
        :label="th.getTranslation(method.displayName)"
        :value="method.id"
        :disabled="loading || makeOrderLoading"
        :selected ="selectedMethod"
        name="spaymentMethod"
        class="form__radio payment-method"
        :class="{'payment-method-applepay' : method.id === bamboraApplePayMethodId }"
        @change="selectMethod(method.id)"
      >
        <div class="payment__label">
          {{ th.getTranslation(method.displayName) }}
        </div>
      </SfRadio>
    </div>
    <transition name="sf-fade">
        <div v-if="isCreditCard" class="credit-card-form">
           <BamboraCreditCard />
        </div>
    </transition>
  </div>
</SfLoader>
</template>

<script>
import { SfButton, SfRadio, SfLoader } from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import { usePaymentMethods, useCart, cartGetters, paymentMethodGetters, useMakeOrder } from '@vue-storefront/orc-vsf';
import { useUiHelpers } from '~/composables';
import BamboraCreditCard from '../Checkout/Payment/Bambora/BamboraCreditCard';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'VsfPaymentProvider',

  components: {
    SfButton,
    SfRadio,
    SfLoader,
    BamboraCreditCard
  },
  setup() {
    const bamboraApplePayMethodId = '084dbf29e00d4709ad4ec8c7562cfefd';
    const { methods: onsiteMethods, load: loadOnsiteMethods, loading: loadingOnSiteMethods} = usePaymentMethods('Onsite payment');
    const { methods: bamboraMethods, load: loadBamboraMethods, loading: loadingCreditCartMethods } = usePaymentMethods('Bambora');
    const { cart, updatePaymentMethod, loading } = useCart();
    const { loading: makeOrderLoading } = useMakeOrder();
    const validMethods = computed(() => {
      if (!bamboraMethods.value || !onsiteMethods.value) return [];
      const allMethods = bamboraMethods.value.concat(onsiteMethods.value);
      return paymentMethodGetters.getValidPaymentMethods(allMethods);
    });
    const payment = computed(() => cartGetters.getActivePayment(cart.value));
    const selectedMethod = computed(() => payment.value?.paymentMethod?.id);
    const isCreditCard = computed(() => payment.value?.paymentMethod?.type === 'CreditCard');
    const th = useUiHelpers();

    const selectMethod = async (id) => {
      const paymentMethod = validMethods.value?.find(p => p.id === id);
      await updatePaymentMethod({paymentMethod});
    };

    onSSR(async () => {
      if (!onsiteMethods.value) {
        await loadOnsiteMethods({providerName: 'Onsite payment'});
      }
      if (!bamboraMethods.value) {
        await loadBamboraMethods({providerName: 'Bambora'});
      }
    });

    return {
      bamboraApplePayMethodId,
      methods: validMethods,
      loadingCreditCartMethods,
      loadingOnSiteMethods,
      makeOrderLoading,
      selectedMethod,
      selectMethod,
      loading,
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
  &-applepay {
     display: none;
  }
}
</style>
