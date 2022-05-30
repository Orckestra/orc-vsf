import CryptoJS from 'crypto-js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getUser(context, params) {

  const { api, scope, myAccount } = context.config;
  const { userToken, username, includeAddresses } = params;
  if (username) {
    const url = new URL(
      `/api/customers/${scope}/byUsername/${username}?IncludeAddresses=${includeAddresses ?? false}`,
      api.url
    );
    const { data } = await context.client.get(url.href);
    return data;
  }

  let customerId = params.customerId;
  if (userToken && !customerId) {
    const bytes = CryptoJS.AES.decrypt(userToken, myAccount.secretPassphrase);
    try {
      const { id, isGuest } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      customerId = id;
      if (isGuest) return null;
    } catch {
      console.log('getUser token parse error');
      return null;
    }
  }

  if (customerId) {
    const url = new URL(
      `/api/customers/${scope}/${customerId}`,
      api.url
    );

    const { data } = await context.client.get(url.href);
    return data;
  }

  return null;
}
