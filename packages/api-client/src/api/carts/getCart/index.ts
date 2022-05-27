import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
import CryptoJS from 'crypto-js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getCart(context, params) {

  const { api, scope, cdnDamProviderConfig, myAccount } = context.config;
  const { userToken, cartName = 'Default' } = params;
  var bytes  = CryptoJS.AES.decrypt(userToken, myAccount.secretPassphrase);
  var customerId = bytes.toString(CryptoJS.enc.Utf8);
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
