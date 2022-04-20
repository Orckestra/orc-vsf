import {
  Context,
  useFacetFactory,
  FacetSearchResult
} from '@vue-storefront/core';
import type {
  UseFacetSearchParams as SearchParams
} from '../types';

const factoryParams = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  search: async (context: Context, params: FacetSearchResult<SearchParams>) => {
    const app: any = context.$occ.config.app;

    const { ...searchParams } = params.input;
    searchParams.locale = app.i18n.locale;

    const { products, total } = await context.$occ.api.getProduct(searchParams);
    return {
      products,
      total
    };
  }
};

export const useFacet = useFacetFactory<SearchParams>(factoryParams);
