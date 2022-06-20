import { buildFacetPredicates, buildFacetPredicatesByFilters } from '../../helpers/buildFacetPredicates';
import { setProductsCoverImages } from '../../helpers/mediaUtils';
import { getRelatedProductsQuery, getCatalogActiveProductsQuery } from '../../helpers/requestQueryUtils';
import { ProductsQueryType } from '../../types';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function getProducts(
  context,
  params
) {
  const { queryType, queryName, categorySlug, withFacetCounts,
    categories, filters, page = 1, itemsPerPage, locale, sort, term, includeFacets = true, facetCounts,
    merchandiseTypes, product } = params;
  const { api, scope, inventoryLocationIds, searchConfig, cdnDamProviderConfig } = context.config;
  const availableProductsUrl = new URL(`/api/search/${scope}/${locale}/availableProducts`, api.url);
  const maximumItems = itemsPerPage ?? searchConfig.defaultItemsPerPage;
  const startingIndex = (page - 1) * maximumItems;
  const inventoryIds = inventoryLocationIds?.split(',') ?? [];
  const availableFacets = searchConfig.availableFacets?.map(f => f.name) ?? [];

  const getSort = (sort) => {
    const defaultSort = {
      direction: '1',
      propertyName: 'score'
    };
    if (!sort) return defaultSort;
    const sortOptions = sort.split('-');
    return {
      direction: sortOptions && sortOptions.length === 2 && sortOptions[1] === 'desc' ? '1' : '0',
      propertyName: sortOptions && sortOptions.length > 0 ? sortOptions[0] : defaultSort.propertyName
    };
  };

  switch (queryType) {
    case ProductsQueryType.Related: {
      if (!merchandiseTypes || !product) {
        console.error('Related query type requires product and merchandiseTypes parameters.');
        return;
      };

      const query = getRelatedProductsQuery(merchandiseTypes, product, itemsPerPage, getSort(sort));
      const { data } = await context.client.post(availableProductsUrl.href, { query });
      const products = data.documents ?? [];
      setProductsCoverImages(products, cdnDamProviderConfig);
      return products;
    }
    case ProductsQueryType.FacetCounts: {
      if (!facetCounts) {
        console.error('FacetCounts query type requires facetCounts parameter.');
        return;
      };
      const { data: facetCountsData } = await context.client.post(availableProductsUrl.href, {
        inventoryLocationIds,
        includeFacets,
        facets: facetCounts,
        query: {
          maximumItems: 0,
          startingIndex: 0
        }
      });
      return { facetCounts: facetCountsData.facets };
    }
    case ProductsQueryType.Merchandising:
    case ProductsQueryType.ProductSet:
      {
        if (!queryName) {
          console.error('Merchandising/ProductSet query type requires queryName parameter.');
          return;
        };
        const productsByQueryNameUrl = new URL(`/api/search/${scope}/${locale}/bySearchQuery/${queryType}/${queryName}`, api.url);
        const facetPredicates = buildFacetPredicatesByFilters(filters, searchConfig);
        let query = getCatalogActiveProductsQuery(scope, maximumItems, startingIndex, [getSort(sort)]);
        const { data } = await context.client.post(productsByQueryNameUrl.href, {
          queryType,
          queryName,
          autoCorrect: true,
          includeFacets: true,
          facetPredicates: facetPredicates,
          facets: availableFacets,
          query,
          searchTerms: term
        });
        const products = data.result?.documents ?? [];
        setProductsCoverImages(products, cdnDamProviderConfig);
        return { products, total: data.result?.totalCount, facets: data.result?.facets, selectedFacets: data.selectedFacets };
      }

    case ProductsQueryType.Category: {
      if (!categorySlug) {
        console.error('Category query type requires categorySlug parameter.');
        return;
      };
      const facetPredicates = buildFacetPredicates(categories, categorySlug, filters, searchConfig);
      let facetCountsResult = [];
      const availableProductsByCategoryUrl = new URL(`/api/search/${scope}/${locale}/availableProducts/byCategory/${categorySlug}`, api.url);
      const { data } = await context.client.post(availableProductsByCategoryUrl.href, {
        inventoryLocationIds: inventoryIds,
        categoryName: categorySlug,
        includeFacets,
        facetPredicates,
        facets: availableFacets,
        query: {
          maximumItems,
          startingIndex,
          sortings: [getSort(sort)]
        },
        searchTerms: term
      });

      if (withFacetCounts || facetCounts) {
        const { data: facetCountsData } = await context.client.post(availableProductsUrl.href, {
          inventoryLocationIds,
          includeFacets,
          facets: facetCounts ?? searchConfig.categoryCountFacets,
          query: {
            maximumItems: 0,
            startingIndex: 0
          }
        });

        facetCountsResult = facetCountsData.facets;
      }

      const products = data.documents ?? [];
      setProductsCoverImages(products, cdnDamProviderConfig);
      return { products, total: data.totalCount, facets: data.facets, facetCounts: facetCountsResult };
    }
    case ProductsQueryType.List:
    default: {
      const { data } = await context.client.post(availableProductsUrl.href, {
        inventoryLocationIds: inventoryIds,
        includeFacets,
        facets: availableFacets,
        query: {
          maximumItems,
          startingIndex,
          sortings: [getSort(sort)]
        },
        searchTerms: term
      });

      const products = data.documents ?? [];
      setProductsCoverImages(products, cdnDamProviderConfig);
      return { products, total: data.totalCount, facets: data.facets };
    }
  }
}
