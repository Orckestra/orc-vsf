import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updateCartItem(context, params) {

  const { api, scope, mediaProviderConfig} = context.config;
  const { cartName = 'Default', id, quantity } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/lineItems/${id}`,
    api.url
  );

  const { data } = await context.client.put(url.href, {
    quantity
  });

  if (data && data.shipments && data.shipments.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, mediaProviderConfig);
  }

  return data;
}
