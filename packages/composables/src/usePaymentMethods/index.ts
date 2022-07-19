import type { PaymentMethod } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { usePaymentMethodsFactory } from '../factories/usePaymentMethodsFactory';
import { getUserToken } from '../helpers/generalUtils';

export const usePaymentMethods = usePaymentMethodsFactory<PaymentMethod>({
  load: async (context: Context, { providerName }) => {
    const userToken = getUserToken(context);
    return await context.$occ.api.getPaymentMethods({userToken, providerName});
  }
});
