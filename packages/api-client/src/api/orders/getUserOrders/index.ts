import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getUserOrders(context, params) {

  const { api, scope, myAccount} = context.config;
  const { userToken } = params;
  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;
  const url = new URL(
      `/api/orders/${scope}/find`,
      api.url
    );
  
    const { data } = await context.client.post(url.href, {customerId});
    return data;
  }
  