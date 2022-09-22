// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getPaymentMethods(context, params) {

  const { api, scope, paymentProviders } = context.config;
  const { cartName = 'Default', providerName } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const providers = providerName ? [providerName] : paymentProviders;

  let result = [];
  for (let index = 0; index < providers.length; index++) {
    const provider = providers[index];
    const cacheKey = `PaymentMethods|${scope}|${provider}|${customerId}`;

    const value = context.cache?.get(cacheKey);
    if (value !== undefined) {
      result = result.concat(value);
    } else {
      const url = new URL(
        `/api/carts/${scope}/${customerId}/${cartName}/${provider}/paymentMethods`,
        api.url);

      const { data } = await context.client.post(url.href, {});
      context.cache?.set(cacheKey, data, 10800);
      result = result.concat(data);
    }
  }
  return result;
}
