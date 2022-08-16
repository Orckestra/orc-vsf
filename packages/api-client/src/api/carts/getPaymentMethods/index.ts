// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getPaymentMethods(context, params) {

  const { api, scope } = context.config;
  const { cartName = 'Default', providerName } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const cacheKey = `PaymentMethods|${scope}|${providerName}|${customerId}`;
  const value = context.cache?.get(cacheKey);
  if (value !== undefined) {
    return value;
  }

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/${providerName}/paymentMethods`,
    api.url);

  const { data } = await context.client.post(url.href, {});
  context.cache?.set(cacheKey, data, 10800);
  return data;
}
