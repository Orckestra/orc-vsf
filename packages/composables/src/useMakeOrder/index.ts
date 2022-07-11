import {
  Context,
  useMakeOrderFactory,
  UseMakeOrderFactoryParams
} from '@vue-storefront/core';
import { getUserToken } from '../helpers/generalUtils';
import type { Order } from '@vue-storefront/orc-vsf-api';

const factoryParams: UseMakeOrderFactoryParams<Order> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  make: async (context: Context, { customQuery }) => {
    const userToken = getUserToken(context);
    return context.$occ.api.completeCheckout({ userToken });
  }
};

export const useMakeOrder = useMakeOrderFactory<Order>(factoryParams);
