import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function initializePayment(context, params) {

  const { api, scope, mediaProviderConfig } = context.config;
  const { cartName = 'Default', paymentId, body } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/payments/${paymentId}/initialize`,
    api.url
  );

  const { data } = await context.client.post(url.href, body);

  if (data?.shipments?.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, mediaProviderConfig);
  }

  return data;
}
