import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function clearCartItems(context, params) {

  const { api, scope, myAccount } = context.config;
  const { userToken, cartName = 'Default' } = params;
  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;

  const url = new URL(
    `/api/carts/${scope}/${customerId}/${cartName}/clear`,
    api.url
  );
  await context.client.delete(url.href);
}
