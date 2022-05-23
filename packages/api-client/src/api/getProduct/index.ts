/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function getProduct(
  context,
  params
) {
  const { id, locale } = params;
  const { api, scope } = context.config;
  const url = new URL(
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

  if (productData.variants && productData.variants.length) {
    productData.variants.forEach(v => {
      v.displayName = v.displayName ? v.displayName[locale] : productData.displayName[locale];
    });
  }

  return {
    ...productData,
    ...{ description: productData.description[locale] },
    name: productData.displayName[locale],
    displayName: productData.displayName[locale],
    prices: { ...pricesData[0] }
  };
}
