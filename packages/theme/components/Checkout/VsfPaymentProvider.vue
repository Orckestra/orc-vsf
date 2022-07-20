<template>
  <div>
    <SfRadio
      v-e2e="'payment-method'"
      v-for="method in methods"
      :key="method.id"
      :label="th.getTranslation(method.displayName)"
      :value="method.id"
      :disabled="loading"
      :selected ="selectedMethod"
      name="spaymentMethod"
      class="form__radio payment"
      @change="selectMethod(method.id)"
    >
      <div class="payment__label">
        {{ th.getTranslation(method.displayName) }}
      </div>
    </SfRadio>
  </div>
</template>

<script>
import { SfButton, SfRadio } from '@storefront-ui/vue';
import { computed, watch } from '@nuxtjs/composition-api';
import { usePaymentMethods, useCart, cartGetters, paymentMethodGetters } from '@vue-storefront/orc-vsf';
import { useUiHelpers } from '~/composables';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'VsfPaymentProvider',

  components: {
    SfButton,
    SfRadio
  },

  setup(props, { emit }) {

    const { methods: onsiteMethods, load: loadOnsiteMethods } = usePaymentMethods('OnsiteMethods');
    const { methods: bamboraMethods, load: loadBamboraMethods } = usePaymentMethods('BamboraMethods');
    const { cart, updatePaymentMethod, loading } = useCart();
    const validMethods = computed(() => {
      const allMethods = bamboraMethods.value.concat(onsiteMethods.value);
      return paymentMethodGetters.getValidPaymentMethods(allMethods);
    });
    const defaultMethod = computed(() => paymentMethodGetters.getDefaultMethod(validMethods.value));
    const payment = computed(() => cartGetters.getActivePayment(cart.value));
    const selectedMethod = computed(() => payment.value?.paymentMethod?.id);
    const isBilling = computed(() => cartGetters.isBillingReady(cart.value));
    const th = useUiHelpers();

    if (selectedMethod) {
      emit('status');
    }

    const selectMethod = async (id) => {
      const paymentMethod = validMethods.value?.find(p => p.id === id);
      await updatePaymentMethod({paymentMethod});
      emit('status');
    };

    onSSR(async () => {
      if (!onsiteMethods.value) {
        await loadOnsiteMethods({providerName: 'Onsite payment'});
      }
      if (!bamboraMethods.value) {
        await loadBamboraMethods({providerName: 'Bambora'});
      }
    });

    watch(isBilling, () => {
      if (isBilling.value && payment?.value && !payment.value.paymentMethod) {
        updatePaymentMethod({paymentMethod: defaultMethod.value});
      }
    });

    return {
      methods: validMethods,
      selectedMethod,
      selectMethod,
      loading,
      th
    };
  }
};
</script>

<style lang="scss" scoped>
.payment {
  &__label {
    display: flex;
    justify-content: space-between;
  }
}
</style>
