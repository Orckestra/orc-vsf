
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function clearCart(context, params) {

  const { api, scope } = context.config;
  const { cartName = 'Default' } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();;
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/clear`,
    api.url
  );
  await context.client.delete(url.href);
}
