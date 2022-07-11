import type { UserOrder } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { useOrderFactory } from '../factories/useOrderFactory';
import { UseOrderFactoryParams } from '../types';

const factoryParams: UseOrderFactoryParams<UserOrder> = {
    find: async (context: Context, params: any) => {
        console.log(params);
        const { orderNumber } = params;
        console.log(orderNumber);
        const data = await context.$occ.api.getOrderByNumber({ orderNumber });
        console.log(data);
        return data;
      }
  };
  export const useOrder =  useOrderFactory<UserOrder>(factoryParams);
  