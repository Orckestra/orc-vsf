<template>
<SfLoader :loading="loadingMethods">
  <div>
    <PaymentMethods :methods="methods" :disabledMethodsIds="disabledMethodsIds" />
    <div v-if="error.load" class="text-danger">Error loading payment methods. Please contact us.</div>
    <div v-if="!methods.length" class="text-warning">No payment provider is configured. Please contact us.</div>
    <transition name="sf-fade">
        <div v-if="isCreditCard" class="credit-card-form">
           <BamboraCreditCard />
        </div>
    </transition>
  </div>
</SfLoader>
</template>

<script>
import { SfLoader } from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import { usePaymentMethods, useCart, cartGetters, paymentMethodGetters } from 'orc-vsf';
import BamboraCreditCard from '../Checkout/Payment/Bambora/BamboraCreditCard';
import PaymentMethods from '../Checkout/PaymentMethods';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'VsfPaymentProvider',

  components: {
    SfLoader,
    BamboraCreditCard,
    PaymentMethods
  },
  setup() {
    const bamboraApplePayMethodId = '084dbf29e00d4709ad4ec8c7562cfefd';
    const { cart } = useCart();
    const { methods, load: loadMethods, loading: loadingMethods, error} = usePaymentMethods('Payment methods');
    const validMethods = computed(() => {
      if (!methods.value) return [];
      return paymentMethodGetters.getValidPaymentMethods(methods.value);
    });
    const payment = computed(() => cartGetters.getActivePayment(cart.value));
    const isCreditCard = computed(() => payment.value?.paymentMethod?.type === 'CreditCard');

    onSSR(async () => {
      if (!methods.value) {
        await loadMethods({});
      }
    });

    return {
      disabledMethodsIds: [bamboraApplePayMethodId],
      methods: validMethods,
      loadingMethods,
      isCreditCard,
      error
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
