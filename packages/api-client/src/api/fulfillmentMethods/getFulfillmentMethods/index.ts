// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getFulfillmentMethods(context, params) {
  const { api, scope } = context.config;
  const { locale, excludeInactive = true } = params;

  const url = new URL(
    `/api/fulfillmentMethods/${scope}?ExcludeInactive=${excludeInactive}`,
    api.url
  );

  const { data } = await context.client.get(url.href);

  return data?.fulfillmentMethods?.map((x) => ({
    ...x,
    displayName: x.displayName[locale],
    shippingProviderId: x.shippingProviderId.replaceAll('-', '')
  })) || [];
}
