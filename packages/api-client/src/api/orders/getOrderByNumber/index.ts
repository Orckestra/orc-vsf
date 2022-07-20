import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getOrderByNumber(context, params) {
  const { api, scope, cdnDamProviderConfig } = context.config;
  const { orderNumber, includeLineItems = true, includeShipment = true, includePayment = true } = params;
  const url = new URL(
    `/api/orders/${scope}/byNumber/${orderNumber}?IncludeLineItems=${includeLineItems}&IncludeShipment=${includeShipment}&IncludePayment=${includePayment}`,
    api.url
  );
  const { data } = await context.client.get(url.href);
  if (data && data.cart.shipments && data.cart.shipments.length) {
    setCartItemsCoverImages(data.cart.shipments[0].lineItems, cdnDamProviderConfig);
  }
  return data;
}
