
import type { OrderItem } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { UseOrdersHistoryFactoryParams } from '../types';
import { getUserToken } from '../helpers/generalUtils';
import { useOrdersHistoryFactory } from '../factories/useOrdersHistoryFactory';


const params: UseOrdersHistoryFactoryParams<OrderItem> = {
  load: async (context: Context) => {

    const app = context.$occ.config.app;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }
    const locale: any = app.i18n.locale;

    const orders: OrderItem[] = await context.$occ.api.getOrders({ userToken, locale });
    return orders;
  }
}

export const useOrdersHistory = useOrdersHistoryFactory<OrderItem>(params);
