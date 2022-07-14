
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function completeCheckout(context, params) {

  const { api, scope } = context.config;
  const { cartName = 'Default' } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();;
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/completeCheckout`,
    api.url
  );

  const { data } = await context.client.post(url.href, {});

  return data;
}
