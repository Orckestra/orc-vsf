//import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getOrders(context, params) {

  const { api, scope, myAccount } = context.config;
  const { userToken, locale } = params;
  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;

  const url = new URL(
    `/api/orders/${scope}/find`,
    api.url
  );

  const body = {
    customerId,
    cultureName: locale,
    includeFulfillmentStates: true
  };

  console.log("url === " + url.href);
  console.log(JSON.stringify(body))

  const { data } = await context.client.put(url.href, body);

  return data.results;

}
