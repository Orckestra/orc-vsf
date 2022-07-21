import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updatePaymentMethod(context, params) {

  const { api, scope, cdnDamProviderConfig } = context.config;
  const { cartName = 'Default', paymentId, id, paymentProviderName } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/payments/${paymentId}/method`,
    api.url
  );

  const body = {
    paymentMethodId: id,
    paymentProviderName
  };
  const { data } = await context.client.put(url.href, body);

  if (data?.shipments?.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, cdnDamProviderConfig);
  }

  return data;
}
