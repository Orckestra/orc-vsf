<template>
  <div>
    <div class="payment-methods">
      <SfRadio
        v-e2e="'payment-method'"
        v-for="method in methods"
        :key="method.id"
        :label="th.getTranslation(method.displayName)"
        :value="method.id"
        :disabled="loading"
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
        <div v-show="isCreditCard" class="credit-card-form">
          <form id="checkout-form">
            <div class="form-group">
              <div class="form-control">
                <input placeholder="Cardholder Name"/>
              </div>
            </div>

            <div class="form-group has-feedback" id="card-number-bootstrap">
              <div id="card-number" class="form-control card-number"></div>
              <label class="sf-input__error-message" for="card-number" id="card-number-error"></label>
            </div>

            <div class="form-group has-feedback" id="card-cvv-bootstrap">
              <div id="card-cvv" class="form-control"></div>
              <label class="sf-input__error-message" for="card-cvv" id="card-cvv-error"></label>
            </div>

            <div class="form-group has-feedback" id="card-expiry-bootstrap">
              <div id="card-expiry" class="form-control"></div>
              <label class="sf-input__error-message" for="card-expiry" id="card-expiry-error"></label>
            </div>
          </form>
        </div>
    </transition>
  </div>
</template>

<script>
import { SfButton, SfRadio } from '@storefront-ui/vue';
import { computed, watch } from '@nuxtjs/composition-api';
import { usePaymentMethods, useCart, cartGetters, paymentMethodGetters } from '@vue-storefront/orc-vsf';
import { useUiHelpers } from '~/composables';
import useBamboraHelpers from '~/composables/useBamboraHelpers';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'VsfPaymentProvider',

  components: {
    SfButton,
    SfRadio
  },
  mounted() {
    const recaptchaScript = document.createElement('script');
    recaptchaScript.setAttribute('src', 'https://libs.na.bambora.com/customcheckout/1/customcheckout.js');
    recaptchaScript.onload = () => {
      const customCheckout = window.customcheckout();
      this.bamboraController = useBamboraHelpers();
      this.bamboraController.init(customCheckout);
    };
    document.head.appendChild(recaptchaScript);
  },
  setup(props, { emit }) {
    const bamboraApplePayMethodId = '084dbf29e00d4709ad4ec8c7562cfefd';
    const { methods: onsiteMethods, load: loadOnsiteMethods } = usePaymentMethods('OnsiteMethods');
    const { methods: bamboraMethods, load: loadBamboraMethods } = usePaymentMethods('BamboraMethods');
    const { cart, updatePaymentMethod, loading } = useCart();
    const validMethods = computed(() => {
      if (!bamboraMethods.value || !onsiteMethods.value) return [];
      const allMethods = bamboraMethods.value.concat(onsiteMethods.value);
      return paymentMethodGetters.getValidPaymentMethods(allMethods);
    });
    const defaultMethod = computed(() => paymentMethodGetters.getDefaultMethod(validMethods.value));
    const payment = computed(() => cartGetters.getActivePayment(cart.value));
    const selectedMethod = computed(() => payment.value?.paymentMethod?.id);
    const isCreditCard = computed(() => payment.value?.paymentMethod?.type === 'CreditCard');
    const isBilling = computed(() => cartGetters.isBillingReady(cart.value));
    const th = useUiHelpers();

    if (selectedMethod.value) {
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
      bamboraApplePayMethodId,
      methods: validMethods,
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
.credit-card-form {
  .form-group {
    margin-bottom: 15px;
    max-width: 200px;
  }
  .form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    box-sizing: border-box;

    input {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: none;
      overflow: visible;
      background-color: transparent;
      outline: none;
    }
  }

  .has-feedback {
    position: relative;
    .form-control {
      padding-right: 42.5px;
    }
  }

  /* card images are added to card number */
  #card-number {
    background-image: none;

    background-origin: content-box;
    background-position: calc(100% + 40px) center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  /* feedback is displayed after tokenization */
  #feedback {
    position: relative;
    left: 15px;
    display: inline-block;
    background-color: transparent;
    border: 0px solid rgba(200, 200, 200, 1);
    border-radius: 4px;
    transition: all 100ms ease-out;
    padding: 11px;
  }

  #feedback.error {
    color: red;
    border: 1px solid;
  }

  #feedback.success {
    color: seagreen;
    border: 1px solid;
  }
}

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
