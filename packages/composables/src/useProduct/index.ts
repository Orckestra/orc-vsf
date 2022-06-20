import {
  Context,
  useProductFactory,
  ProductsSearchParams,
  UseProductFactoryParams
} from '@vue-storefront/core';
import { ProductsQueryType } from '@vue-storefront/orc-vsf-api';
import type { Product } from '@vue-storefront/orc-vsf-api';
import type { UseProductSearchParams as SearchParams } from '../types';

const params: UseProductFactoryParams<Product, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productsSearch: async (
    context: Context,
    params: ProductsSearchParams & {
      queryType: ProductsQueryType;
    }
  ): Promise<Product> => {
    const app: any = context.$occ.config.app;
    const locale: any = app.i18n.locale;
    const { queryType, limit } = params;

    switch (queryType) {
      case ProductsQueryType.Detail:
        return await context.$occ.api.getProduct({ ...params, locale });
      default:
        return await context.$occ.api.getProducts({ ...params, includeFacets: false, itemsPerPage: limit, locale });
    }
  }
};

export const useProduct = useProductFactory<Product, SearchParams>(params);
