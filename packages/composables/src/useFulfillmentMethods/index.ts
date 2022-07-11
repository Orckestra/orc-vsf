import { Context } from '@vue-storefront/core';
import { useFulfillmentMethodsFactory } from '../factories/useFulfillmentMethodsFactory';
import type { FulfillmentMethod } from '@vue-storefront/orc-vsf-api';
import { getUserToken } from '../helpers/generalUtils';

export const useFulfillmentMethods = useFulfillmentMethodsFactory<FulfillmentMethod>({
  load: (context: Context) => {
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    return context.$occ.api.getFulfillmentMethods({ userToken });
  }
});
