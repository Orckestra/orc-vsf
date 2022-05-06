/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function getProducts(
  context,
  params
) {
  const { catId, categorySlug, withCategoryCounts, facetPredicates, page, itemsPerPage, locale } = params;
  const { api, scope, inventoryLocationIds, searchConfig, cdnDamProviderConfig } = context.config;
  let url = null;

  const setCoverImages = (products: any) => {
    const { serverUrl, imageFolderName } = cdnDamProviderConfig;
    products.forEach((pr: any) => {
      const imageUrl = pr.propertyBag?.ImageUrl;
      if (imageUrl) {
        pr.coverImage = imageUrl;
      } else {
        let variantId = pr.propertBag?.VarialtId;
        pr.coverImage = `${serverUrl}/${imageFolderName}/${pr.productId}_${variantId ? `${variantId}_` : ''}0_M.jpg`;
      }
    });
  }

  if (catId) {
    console.log('TODO: Related');
    return [];
  } else if (categorySlug) {
    let categoryCounts = [];
    url = new URL(`/api/search/${scope}/${locale}/availableProducts/byCategory/${categorySlug}`, api.url);
    const maximumItems = itemsPerPage ?? searchConfig.defaultItemsPerPage;
    const { data } = await context.client.post(url.href, {
      inventoryLocationIds,
      categoryName: categorySlug,
      includeFacets: true,
      facetPredicates,
      facets: searchConfig.availableFacets,
      query: {
        maximumItems: maximumItems,
        startingIndex: (page - 1) * maximumItems,
        sortings: [
          {
            direction: 0,
            propertyName: 'score'
          }
        ]
      }
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
        }
      });

      categoryCounts = categoryCountsData.facets;
    }

    let products = data.documents ?? [];
    setCoverImages(products);
    return { products, total: data.totalCount, facets: data.facets, categoryCounts };
  } else {

    url = new URL(`/api/search/${scope}/${locale}/availableProducts`, api.url);

    const { data } = await context.client.post(url.href, {
      query: {
        distinctResults: true,
        maximumItems: searchConfig.defaultItemsPerPage,
        startingIndex: 0
      }
    });

    return { products: data.documents ?? [], total: data.totalCount, facets: data.facets };
  }
}
