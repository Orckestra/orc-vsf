import { buildFacetPredicates } from '../../helpers/buildFacetPredicates';
import { setProductsCoverImages } from '../../helpers/mediaUtils';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function getProducts(
  context,
  params
) {
  const { catId, categorySlug, withCategoryCounts, categories, filters, page, itemsPerPage, locale, sort, term, autoSuggest } = params;
  const { api, scope, inventoryLocationIds, searchConfig, cdnDamProviderConfig } = context.config;
  let url = null;

  const getSort = (sort) => {
    if (!sort) return {};
    const sortOptions = sort.split('-');
    return {
      direction: sortOptions && sortOptions.length === 2 && sortOptions[1] === 'desc' ? '1' : '0',
      propertyName: sortOptions && sortOptions.length > 0 ? sortOptions[0] : 'score'
    };
  };

  if (autoSuggest) {
    url = new URL(
      `/api/search/${scope}/${locale}/advanced/Products`,
      api.url
    );

    const { data } = await context.client.post(url.href, {
      facetHierarchyId: autoSuggest,
      includeFacets: true,
      searchTerms: '*'
    });

    return { categoryCounts: data.facets };
  } else if (catId) {
    console.log('TODO: Related');
    return [];
  } else if (categorySlug) {
    const facetPredicates = buildFacetPredicates(categories, categorySlug, filters, searchConfig);
    let categoryCounts = [];
    url = new URL(`/api/search/${scope}/${locale}/availableProducts/byCategory/${categorySlug}`, api.url);
    const maximumItems = itemsPerPage ?? searchConfig.defaultItemsPerPage;
    const { data } = await context.client.post(url.href, {
      inventoryLocationIds: inventoryLocationIds.split(','),
      categoryName: categorySlug,
      includeFacets: true,
      facetPredicates,
      facets: searchConfig.availableFacets.map(f => f.name),
      query: {
        maximumItems: maximumItems,
        startingIndex: (page - 1) * maximumItems,
        sortings: [getSort(sort)]
      },
      searchTerms: term
    });

    if (withCategoryCounts) {
      url = new URL(`/api/search/${scope}/${locale}/availableProducts`, api.url);
      const { data: categoryCountsData } = await context.client.post(url.href, {
        inventoryLocationIds,
        includeFacets: true,
        facets: searchConfig.categoryCountFacets,
        query: {
          maximumItems: 0,
          startingIndex: 0
        },
        searchTerms: term
      });

      categoryCounts = categoryCountsData.facets;
    }

    const products = data.documents ?? [];
    setProductsCoverImages(products, cdnDamProviderConfig);
    return { products, total: data.totalCount, facets: data.facets, categoryCounts };
  } else {

    url = new URL(`/api/search/${scope}/${locale}/availableProducts`, api.url);

    const { data } = await context.client.post(url.href, {
      query: {
        distinctResults: true,
        maximumItems: searchConfig.defaultItemsPerPage,
        startingIndex: 0,
        sortings: [getSort(sort)]
      },
      searchTerms: term
    });
    const products = data.documents ?? [];
    setProductsCoverImages(products, cdnDamProviderConfig);
    return { products, total: data.totalCount, facets: data.facets };
  }
}
