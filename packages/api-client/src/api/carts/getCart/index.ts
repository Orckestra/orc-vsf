import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getCart(context, params) {

  const { api, scope, cdnDamProviderConfig } = context.config;
  const { customerId, cartName = 'Default' } = params;
  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}`,
    api.url
  );

  const { data } = await context.client.get(url.href);
  if (data && data.shipments && data.shipments.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, cdnDamProviderConfig);
  }

  return data;
}