import type { UserOrder } from 'orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { useOrderFactory } from '../factories/useOrderFactory';
import { UseOrderFactoryParams } from '../types';

const factoryParams: UseOrderFactoryParams<UserOrder> = {
  find: async (context: Context, params: any) => {
    const { orderNumber, orderId } = params;
    const data = orderNumber ? await context.$occ.api.getOrderByNumber({ orderNumber }) : await context.$occ.api.getOrderById({ orderId });
    return data;
  }
};
export const useOrder = useOrderFactory<UserOrder>(factoryParams);
