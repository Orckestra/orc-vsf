import {
  Context,
  useProductFactory,
  ProductsSearchParams,
  UseProductFactoryParams
} from '@vue-storefront/core';
import type { Product } from '@vue-storefront/orc-vsf-api';
import type { UseProductSearchParams as SearchParams } from '../types';

const params: UseProductFactoryParams<Product, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productsSearch: async (
    context: Context,
    params: ProductsSearchParams
  ): Promise<Product> => {
    const app: any = context.$occ.config.app;

    const locale: any = app.i18n.locale;
    return await context.$occ.api.getProduct({ ...params, locale });
  }
};

export const useProduct = useProductFactory<Product, SearchParams>(params);
