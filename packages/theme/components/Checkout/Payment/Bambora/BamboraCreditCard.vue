<template>
  <form id="checkout-form">

    <div class="form-group">
      <div class="form-control">
        <input v-model.lazy="cardholderNameInput"  placeholder="Cardholder name"/>
      </div>
    </div>

    <div class="form-group has-feedback">
      <div id="card-number" class="form-control card-number"></div>
        <label class="sf-input__error-message" for="card-number" id="card-number-error"></label>
    </div>

    <div class="form-group">
      <div class="grid">

        <div class="has-feedback">
          <div id="card-cvv" class="form-control"></div>
          <label class="sf-input__error-message" for="card-cvv" id="card-cvv-error"></label>
        </div>

        <div class="has-feedback">
          <div id="card-expiry" class="form-control"></div>
          <label class="sf-input__error-message" for="card-expiry" id="card-expiry-error"></label>
        </div>

      </div>
    </div>

  </form>
</template>

<script>
import { ref, watch } from '@nuxtjs/composition-api';
import { useCreditCardForm } from '@vue-storefront/orc-vsf';
export default {
  name: 'BamboraCreditCard',
  setup() {
    const { init: initCreditCardForm, setCustomController, updateCardholderName, cardholderName } = useCreditCardForm();
    const cardholderNameInput = ref(cardholderName?.value);
    watch(cardholderNameInput, () => {
      updateCardholderName(cardholderNameInput.value);
    });

    return {
      setCustomController,
      initCreditCardForm,
      cardholderNameInput
    };
  },
  mounted() {
    // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
    const self = this;
    const src = 'https://libs.na.bambora.com/customcheckout/1/customcheckout.js';
    const scripts = document.getElementsByTagName('script');
    let foundScript = false;
    for (let i = scripts.length; i--;) {
      if (scripts[i]?.src === src) {
        foundScript = true;
      }
    }

    const initializeCustomController = () => {
      const customCheckout = window.customcheckout();
      const customControllerInitValue = {
        isCardNumberComplete: false,
        isCVVComplete: false,
        isExpiryComplete: false,
        controller: customCheckout
      };
      self.setCustomController(customControllerInitValue);
      self.initCreditCardForm();
    };

    if (!foundScript) {
      const bamboraScript = document.createElement('script');
      bamboraScript.async = true;
      bamboraScript.id = 'dynamic-script';
      bamboraScript.setAttribute('src', src);
      bamboraScript.onload = () => {
        initializeCustomController();
      };
      document.head.appendChild(bamboraScript);
    } else {
      initializeCustomController();
    }
  }
};
</script>

<style lang="scss" scoped>
.credit-card-form {
  .form-group {
    margin-bottom: 15px;
    max-width: 300px;
  }
  .grid {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 20px;
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
}
</style>
