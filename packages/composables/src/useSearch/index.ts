import {
  Context,
  useSearchFactory,
  ProductsSearchParams
} from '@vue-storefront/core';
import type { SearchResults } from '@vue-storefront/orc-vsf-api';

const factoryParams = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  search: async (context: Context, params: ProductsSearchParams) : Promise<SearchResults> => {
    const app: any = context.$occ.config.app;
    const { ...searchParams } = params;
    searchParams.locale = app.i18n.locale;

    const { products, total, facets, categoryCounts } = await context.$occ.api.getProducts(searchParams);
    return {
      products,
      total,
      facets,
      categories: searchParams.categories,
      categoryCounts
    };
  }
};

export const useSearch = useSearchFactory<SearchResults, ProductsSearchParams>(factoryParams);
