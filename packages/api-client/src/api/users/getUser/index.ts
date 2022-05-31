import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getUser(context, params) {

  const { api, scope, myAccount } = context.config;
  const { userToken } = params;
  const { id, isGuest } = parseUserToken(userToken, myAccount.secretPassphrase);

  if (id && !isGuest) {
    const url = new URL(
      `/api/customers/${scope}/${id}`,
      api.url
    );

    const { data } = await context.client.get(url.href);
    return data;
  }

  return null;
}
