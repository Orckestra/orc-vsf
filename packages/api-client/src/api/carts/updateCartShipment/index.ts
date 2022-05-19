import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updateCartShipment(context, params) {
  const { api, scope, cdnDamProviderConfig } = context.config;
  const { customerId, cartName, updateShipmentRequest} = params;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/shipments/${updateShipmentRequest.id}`,
    api.url
  );

  const { data } = await context.client.put(url.href, updateShipmentRequest);

  if (data && data.shipments && data.shipments.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, cdnDamProviderConfig);
  }

  return data;
}
