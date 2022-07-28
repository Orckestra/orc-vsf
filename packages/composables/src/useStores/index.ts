import { UseStoresSearchParams, UseStoresFactoryParams } from '../types';
import { Context } from '@vue-storefront/core';
import { useStoresFactory } from '../factories/useStoresFactory';
import type { StoreQueryResult } from '@vue-storefront/orc-vsf-api';

const params: UseStoresFactoryParams<StoreQueryResult, UseStoresSearchParams> = {

  search: async (context: Context, params: UseStoresSearchParams): Promise<StoreQueryResult> => {
    const app = context.$occ.config.app;
    const locale: any = app.i18n.locale;
    const res = await context.$occ.api.findStores({ locale, page: params.page, itemsPerPage: params.itemsPerPage, sorting: params.sorting });
    return res;
  }
};

export const useStores = useStoresFactory<StoreQueryResult, UseStoresSearchParams>(params);
