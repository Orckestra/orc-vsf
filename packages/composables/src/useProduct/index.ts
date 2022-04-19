import {
  Context,
  useProductFactory,
  ProductsSearchParams,
  UseProductFactoryParams
} from '@vue-storefront/core';
import type { Product } from '@vue-storefront/orc-vsf-api';
import type {
  UseProductSearchParams as SearchParams
} from '../types';

const params: UseProductFactoryParams<Product, SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productsSearch: async (context: Context, params: ProductsSearchParams): Promise<Product>  => {
    const app = context.$occ;
    console.log('APP');
    console.log(app);
    var x = await context.$occ.api.getProduct(params);
    
    return x;
  }
};

export const useProduct = useProductFactory<Product, SearchParams>(params);
