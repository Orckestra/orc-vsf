import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updateUserAddress(context, params) {

  const { api, myAccount } = context.config;
  const { userToken, address, addressId } = params;
  const { id, isGuest } = parseUserToken(userToken, myAccount.secretPassphrase);

  if (id && !isGuest) {
    const url = new URL(
      `/api/customers/${id}/addresses/${addressId}`,
      api.url
    );

    const { data } = await context.client.put(url.href, address);
    return data;
  }

  return null;
}
