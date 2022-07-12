<template>
  <div>
    <SfRadio
      v-e2e="'payment-method'"
      v-for="method in methods"
      :key="method.id"
      :label="th.getTranslation(method.displayName)"
      :value="method.id"
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
import { ref, computed } from '@nuxtjs/composition-api';
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
    const selectedMethod = ref('d1d43d03e79144698f93503c4e46ec5b');
    const { methods: onsiteMethods, load } = usePaymentMethods('Onsite');
    const { cart } = useCart();
    const validMethods = computed(() => paymentMethodGetters.getValidPaymentMethods(onsiteMethods.value))
    const payment = computed(() => cartGetters.getActivePayment(cart.value));
    const th = useUiHelpers();
    const selectMethod = (method) => {
      selectedMethod.value = method;
      emit('status');
    };

      onSSR(async () => {
      if (!onsiteMethods.value) {
        await load({providerName: 'Onsite payment'});
      }
    });


    return {
      methods: validMethods,
      selectedMethod,
      selectMethod,
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
