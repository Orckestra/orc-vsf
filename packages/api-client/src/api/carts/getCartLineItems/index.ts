import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getCartLineItems(context, params) {

  const { api, scope, mediaProviderConfig } = context.config;
  const { cartName = 'Default' } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/lineItems`,
    api.url
  );

  const { data } = await context.client.get(url.href);
  setCartItemsCoverImages(data, mediaProviderConfig);
  return data;
}
