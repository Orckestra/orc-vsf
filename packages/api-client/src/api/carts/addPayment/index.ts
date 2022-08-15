import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function addPayment(context, params) {

  const { api, scope, cdnDamProviderConfig } = context.config;
  const { cartName = 'Default', billingAddress } = params;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/payments`,
    api.url
  );

  const { data } = await context.client.post(url.href, { billingAddress });

  if (data?.shipments?.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, cdnDamProviderConfig);
  }

  return data;
}
