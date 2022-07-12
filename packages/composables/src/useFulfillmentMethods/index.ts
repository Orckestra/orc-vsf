import { Context } from '@vue-storefront/core';
import { useFulfillmentMethodsFactory } from '../factories/useFulfillmentMethodsFactory';
import type { FulfillmentMethod } from '@vue-storefront/orc-vsf-api';
import { getUserToken } from '../helpers/generalUtils';
import { FulfillmentMethodType } from '@vue-storefront/orc-vsf-api';

export const useFulfillmentMethods = useFulfillmentMethodsFactory<FulfillmentMethod>({
  load: async (context: Context) => {
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    const items = await context.$occ.api.getFulfillmentMethods({ userToken });
    const typeOrder = [FulfillmentMethodType.Shipping, FulfillmentMethodType.PickUp];

    return items.sort((a, b) => (typeOrder.indexOf(a.fulfillmentMethodType) - typeOrder.indexOf(b.fulfillmentMethodType)) || a.cost - b.cost);
  }
});
