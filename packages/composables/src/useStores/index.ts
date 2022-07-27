import { UseStoresSearchParams, UseStoresFactoryParams } from '../types';
import { Context } from '@vue-storefront/core';
import { useStoresFactory } from '../factories/useStoresFactory';
import type { SearchQueryResult as StoresSearchResults } from '@vue-storefront/orc-vsf-api';

const params: UseStoresFactoryParams<StoresSearchResults, UseStoresSearchParams> = {

  search: async (context: Context, params: UseStoresSearchParams) => {
    const app = context.$occ.config.app;
    const locale: any = app.i18n.locale;
    const res = await context.$occ.api.findStores({ locale, page: params.page, itemsPerPage: params.itemsPerPage });

    const locations = await context.$occ.api.getFulfillmentLocations({ includeChildScopes: true, onlyActive: true, includeSchedules: true });

    if (res.results) {
      res.results.forEach(element => {
        const fulfillmentLocation = locations.find(el => el.id === element.fulfillmentLocation.id);
        element.fulfillmentLocation.schedules = fulfillmentLocation.schedules;
      });
    }
    return res;
  }
};

export const useStores = useStoresFactory<StoresSearchResults, UseStoresSearchParams>(params);
