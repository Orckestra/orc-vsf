import type { Order } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { useOrderFactory } from '../factories/useOrderFactory';

export const useOrder = useOrderFactory<Order>({
  find: async (context: Context, params: any) => {
    const { orderNumber } = params;
    return await context.$occ.api.getOrderByNumber({ orderNumber });
  }
});
