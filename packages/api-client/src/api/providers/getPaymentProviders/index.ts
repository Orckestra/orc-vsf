// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getPaymentProviders(context, params) {

  const { api, scope } = context.config;
  const { includeInactive = false } = params;

  const url = new URL(
    `/api/providers/${scope}/payment?IncludeInactive=${includeInactive}`,
    api.url
  );

  const { data } = await context.client.get(url.href);

  return data;
}
