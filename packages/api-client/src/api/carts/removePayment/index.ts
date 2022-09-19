import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function removePayment(context, params) {

  const { api, scope, mediaProviderConfig } = context.config;
  const { cartName = 'Default', paymentId } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/payments/${paymentId}`,
    api.url
  );

  const { data } = await context.client.delete(url.href);

  if (data?.shipments?.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, mediaProviderConfig);
  }

  return data;
}
