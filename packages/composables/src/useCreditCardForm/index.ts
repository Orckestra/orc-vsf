import {
  Context,
  Logger
} from '@vue-storefront/core';
import { useCreditCardFormFactory, UseCreditCardFormParams } from '../factories/useCreditCardFormFactory';
import { CreaditCardCustomController } from '../types';
import bamboraCustomCheckoutUtils from './bamboraCustomCheckoutUtils';

const params: UseCreditCardFormParams<CreaditCardCustomController> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init: async (context: Context, { currentController, updateControllerCallback }) => {
    Logger.debug('[OCC Storefront]: Init  Credit Card form');
    bamboraCustomCheckoutUtils.createInputs(currentController.controller);
    bamboraCustomCheckoutUtils.addListeners(currentController.controller, updateControllerCallback);
  },
  createTokenData: async (context: Context, { currentController, cardholderName }) => {

    const promise = new Promise((resolve, reject) => {
      currentController.controller.createToken((result) => {
        if (result.error) {
          reject(result.error);
        } else {
          const tokenData = {
            BamboraToken: result.token,
            CardHolderName: cardholderName,
            CreditCardNumberLastDigits: result.last4,
            ExpiryDate: `${result.expiryMonth} ${result.expiryYear}`,
            CreatePaymentProfile: false
          };
          resolve(tokenData);
        }
      });
    });
    return promise;
  }
};

export const useCreditCardForm = useCreditCardFormFactory<any>(params);
