# useUser

## Features
`useCreditCardForm` composable is responsible for initializing and creating token data for the Bambora Payment Provider. It uses Custom Checkout https://dev.na.bambora.com/docs/guides/custom_checkout/setup/ for implemantation

## API
```typescript
interface useCreditCardForm<CreaditCardCustomController, API extends PlatformApi = any> extends Composable<API>  {
  init: (params: { currentController: CreaditCardCustomController, updateControllerCallback, updateErrorCallback }) => Promise<void>;
  createTokenData:(params: { currentController: CreaditCardCustomController, cardholderName }) => Promise<void>;
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UseCreditCardFormErrors>;
  customController: ComputedProperty<CreaditCardCustomController>;
  cardholderName: ComputedProperty<string>;
}


```

### `init`
Function that initialize custom controller responsible for the credit card form. 

### `createTokenData`
Function for getting card token data, which can be provided by current custom controller.

### `customController`
Object containing information about current form controlller.

### `error`
Reactive object containing the error message, if card inputs have errors.

## Example

```javascript
import { watch } from 'vue'
import { onSSR } from '@vue-storefront/core';
import { useCreditCardForm } from 'orc-vsf';

export default {
  setup () {
   const {  init: initCreditCardForm, setCustomController } = useCreditCardForm();

    return {
      initCreditCardForm,
      setCustomController
    }
  },
  mounted() {
    const src = 'https://libs.na.bambora.com/customcheckout/1/customcheckout.js';

    const initializeCustomController = () => {
      const customCheckout = window.customcheckout();
      const customControllerInitValue = {
        isCardNumberComplete: false,
        isCVVComplete: false,
        isExpiryComplete: false,
        controller: customCheckout
      };
      this.setCustomController(customControllerInitValue);
      this.initCreditCardForm();
    };

    const bamboraScript = document.createElement('script');
    bamboraScript.async = true;
    bamboraScript.id = 'dynamic-script';
    bamboraScript.setAttribute('src', src);
    bamboraScript.onload = () => {
      initializeCustomController();
    };
    document.head.appendChild(bamboraScript);
  }
}
```