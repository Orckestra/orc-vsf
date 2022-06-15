import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function deleteUserAddress(context, params) {
  const { api, myAccount } = context.config;
  const { userToken, addressId } = params;
  const { id, isGuest } = parseUserToken(userToken, myAccount.secretPassphrase);

  if (id && !isGuest) {
    const url = new URL(
      `/api/addresses/${addressId}`,
      api.url
    );

    const { data } = await context.client.delete(url.href);
    return data;
  }

  return null;
}
