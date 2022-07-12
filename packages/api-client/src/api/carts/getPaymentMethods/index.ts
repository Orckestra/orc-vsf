import { parseUserToken } from '../../../helpers/generalUtils';
import { promises } from 'dns';
import { json } from 'stream/consumers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getPaymentMethods(context, params) {

  const { api, scope, myAccount, payment } = context.config;
  const { userToken, cartName = 'Default', providerName } = params;
  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/${providerName}/paymentMethods`,
    api.url);


  const { data } = await context.client.post(url.href, {});

  return data;
}
