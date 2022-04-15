import {
  Context,
  useProductFactory,
  UseProductFactoryParams
} from '@vue-storefront/core';
import type { Product } from '@vue-storefront/orc-vsf-api';
import type {
  UseProductSearchParams as SearchParams
} from '../types';

const params: UseProductFactoryParams<Product, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productsSearch: async (context: Context, params) => {
    console.log(123);
    var x = await context.$occ.api.getProduct(params);
    
    return x;
    //return await context.$occ.api.getProduct(params);

    return {};
  }
};

export const useProduct = useProductFactory<Product, SearchParams>(params);
