
import type { OrderQueryResult } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { getUserToken } from '../helpers/generalUtils';
import { useOrdersHistoryFactory } from '../factories/useOrdersHistoryFactory';
import { UseOrdersHistoryFactoryParams} from '../types';

const factoryParams: UseOrdersHistoryFactoryParams<OrderQueryResult> = {
  load: async (context: Context, { orderTense, page, itemsPerPage }) => {
    const app = context.$occ.config.app;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }
    const locale: any = app.i18n.locale;
    return await context.$occ.api.getOrders({ userToken, locale, orderTense, page, itemsPerPage });
  }
};
export const useOrdersHistory = useOrdersHistoryFactory<OrderQueryResult>(factoryParams);

