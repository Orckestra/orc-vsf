import {
  Context,
  useUserOrderFactory,
  UseUserOrderFactoryParams
} from '@vue-storefront/core';
import type { SearchQueryResult as OrderQueryResult } from '@vue-storefront/orc-vsf-api';
import type {
  useUserOrderSearchParams as SearchParams
} from '../types';
import { getUserToken } from '../helpers/generalUtils';

const params: UseUserOrderFactoryParams<OrderQueryResult, SearchParams> = {
  searchOrders: async (context: Context, { page, itemsPerPage, filterMember, filterValues }) => {
    const app = context.$occ.config.app;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }
    const locale: any = app.i18n.locale;
    const res = await context.$occ.api.findOrders({ userToken, locale, page, itemsPerPage, filterMember, filterValues });
    return res;
  }
};

export const useUserOrder = useUserOrderFactory<OrderQueryResult, SearchParams>(params);
