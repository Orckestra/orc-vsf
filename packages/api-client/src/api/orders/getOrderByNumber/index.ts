import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
import { isGuidEquals } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getOrderByNumber(context, params) {
  const { api, scope, cdnDamProviderConfig } = context.config;
  const { orderNumber, includeLineItems = true, includeShipment = true, includePayment = true } = params;
  const url = new URL(
    `/api/orders/${scope}/byNumber/${orderNumber}?IncludeLineItems=${includeLineItems}&IncludeShipment=${includeShipment}&IncludePayment=${includePayment}`,
    api.url
  );
  const { id: customerId } = context.config.auth.getCustomerToken();
  const { data } = await context.client.get(url.href);
  if (!isGuidEquals(data.customerId, customerId)) {
    console.error('Order id does not match to current user id');
    return null;
  }
  if (data && data.cart.shipments && data.cart.shipments.length) {
    setCartItemsCoverImages(data.cart.shipments[0].lineItems, cdnDamProviderConfig);
  }
  return data;
}
