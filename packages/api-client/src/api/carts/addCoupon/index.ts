import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function addCoupon(context, params) {

  const { api, scope, cdnDamProviderConfig, myAccount } = context.config;
  const { userToken, cartName = 'Default', couponCode } = params;
  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/coupons/${couponCode}`,
    api.url
  );

  const { data } = await context.client.post(url.href, {});

  if (data && data.shipments && data.shipments.length) {
    setCartItemsCoverImages(data.shipments[0].lineItems, cdnDamProviderConfig);
  }

  return data;
}
