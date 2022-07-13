// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
export default async function getOrderByNumber(context, params) {
  const { api, scope, cdnDamProviderConfig } = context.config;
  const { orderNumber } = params;
  const url = new URL(
    `/api/orders/${scope}/byNumber/${orderNumber}?IncludeLineItems=true&IncludeShipment=true&IncludePayment=true`,
    api.url
  );
  const { data } = await context.client.get(url.href);
  if (data && data.cart.shipments && data.cart.shipments.length) {
    setCartItemsCoverImages(data.cart.shipments[0].lineItems, cdnDamProviderConfig);
  }
  return data;
}