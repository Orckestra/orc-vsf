import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function removeCartItems(context, params) {

  const { api, scope, cdnDamProviderConfig } = context.config;
  const { cartName = 'Default', lineItemIds } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/lineItems/batch?LineItemIds=${lineItemIds.join(',')}`,
    api.url
  );

  const { data } = await context.client.delete(url.href);

  if (data && data.shipments && data.shipments.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, cdnDamProviderConfig);
  }

  return data;
}
