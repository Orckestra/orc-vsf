import { setProductImage } from '../../helpers/mediaUtils';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function getProduct(
  context,
  params
) {
  const { id, locale } = params;
  const { api, scope, mediaProviderConfig } = context.config;
  const url = new URL(
    `/api/products/v2/${scope}/${id}?CultureName=${locale}&IncludeMedia=true&IncludeVariants=true&IncludeImageUrl=true&IncludeRelationships=true`,
    api.url
  );
  const getPricesUrl = new URL(`/api/products/${scope}/${id}/price`, api.url);
  const { data: productData } = await context.client.get(url.href);
  const { data: pricesData } = await context.client.post(getPricesUrl.href, {
    IncludeVariants: true,
    ScopeId: scope
  });

  if (productData.variants && productData.variants.length) {
    productData.variants.forEach(v => {
      v.displayName = v.displayName ? v.displayName[locale] : productData.displayName[locale];
    });
  }

  setProductImage(productData, mediaProviderConfig);

  return {
    ...productData,
    ...{ description: productData.description?.[locale] },
    name: productData.displayName[locale],
    displayName: productData.displayName[locale],
    prices: pricesData
  };
}
