import {
  Context,
  useFacetFactory,
  FacetSearchResult
} from '@vue-storefront/core';
import { AgnosticFacetSearchParams } from '@vue-storefront/core';
import { useCategory } from '../useCategory';
import { buildFacetPredicates } from '../helpers/buildFacetPredicates';

const factoryParams = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  search: async (context: Context, params: FacetSearchResult<AgnosticFacetSearchParams>) => {
    const app: any = context.$occ.config.app;
    const { categories } = useCategory('categories');
    const { ...searchParams } = params.input;
    searchParams.locale = app.i18n.locale;
    const { categorySlug } = searchParams;
    searchParams.facetPredicates = buildFacetPredicates(categories.value, categorySlug);
    const { products, total, facets, categoryCounts } = await context.$occ.api.getProducts(searchParams);
    return {
      products,
      total,
      facets,
      categories: categories.value,
      categoryCounts
    };
  }
};

export const useFacet = useFacetFactory<AgnosticFacetSearchParams>(factoryParams);
