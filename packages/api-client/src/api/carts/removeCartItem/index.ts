import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function removeCartItem(context, params) {

  const { api, scope, cdnDamProviderConfig } = context.config;
  const { customerId, cartName = 'Default', id } = params;
  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/lineItems/${id}`,
    api.url
  );

  const { data } = await context.client.delete(url.href);

  if (data && data.shipments && data.shipments.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, cdnDamProviderConfig);
  }
  return data;
}
