import {
  Context,
  useUserOrderFactory,
  UseUserOrderFactoryParams
} from '@vue-storefront/core';
import type { Order } from '@vue-storefront/orc-vsf-api';
import type {
  useUserOrderSearchParams as SearchParams
} from '../types';
import { getUserToken, setUserToken } from '../helpers/generalUtils';

const params: UseUserOrderFactoryParams<Order, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchOrders: async (context: Context, params) => {
    let userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      userToken = await context.$occ.api.initializeGuestToken();
      setUserToken(context, userToken);
    }
    if (userToken) {
      return await context.$occ.api.getUserOrders({ ...params, userToken });
    }
  }
};

export const useUserOrder = useUserOrderFactory<Order, SearchParams>(params);
