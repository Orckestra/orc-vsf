/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomQuery } from '@vue-storefront/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getProduct(
  context,
  params,
  customQuery?: CustomQuery
) {
  const { id, catId, categorySlug, page, itemsPerPage, locale } = params;
  const { api, scope, inventoryLocationIds, searchConfig } = context.config;
  let url = null;
  console.log('I am in getProduct');
  console.log(params);

  if (id) {

    url = new URL(
      `/api/products/v2/${scope}/${id}?CultureName=${locale}&IncludeMedia=true&IncludeVariants=true&IncludeImageUrl=true`,
      api.url
    );

    const getPricesUrl = new URL(`/api/products/${scope}/prices`, api.url);
    const { data: productData } = await context.client.get(url.href);
    const { data: pricesData } = await context.client.post(getPricesUrl.href, {
      ProductIds: [id],
      IncludeVariants: true,
      ScopeId: scope
    });

    return { ...productData, ...{ description: productData.description[locale] }, name: productData.displayName[locale], prices: { ...pricesData[0] } };

  } else if (catId) {
    console.log('TODO: Related');
    return [];
  } else if (categorySlug) {
    console.log('CategoryPage');
    url = new URL(
      `/api/search/${scope}/${locale}/availableProducts/byCategory/${categorySlug}`,
      api.url
    );
    const maximumItems = itemsPerPage ?? searchConfig.defaultItemsPerPage;
    const { data } = await context.client.post(url.href, {
      inventoryLocationIds,
      categoryName: categorySlug,
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

    return { products: data.documents ?? [], total: data.totalCount };
  } else {

    url = new URL(
      `/api/search/${scope}/${locale}/availableProducts`,
      api.url
    );

    const { data } = await context.client.post(url.href, {
      query: {
        distinctResults: true,
        maximumItems: searchConfig.defaultItemsPerPage,
        startingIndex: 0
      }
    });

    return data.documents ?? [];
  }
}
