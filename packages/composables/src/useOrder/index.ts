import type { UserOrder } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { useOrderFactory } from '../factories/useOrderFactory';
import { UseOrderFactoryParams } from '../types';

const factoryParams: UseOrderFactoryParams<UserOrder> = {
    find: async (context: Context, params: any) => {
        const { orderNumber } = params;
        const data = await context.$occ.api.getOrderByNumber({ orderNumber });
        return data;
      }
  };
  export const useOrder =  useOrderFactory<UserOrder>(factoryParams);
  