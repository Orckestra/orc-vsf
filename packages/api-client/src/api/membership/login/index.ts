import CryptoJS from 'crypto-js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function login(context, params) {

  const { api, scope, myAccount } = context.config;
  const { password, username } = params;
  const url = new URL(
    `/api/membership/${scope}/Login`,
    api.url
  );
  const { data } = await context.client.put(url.href, {
    password,
    username
  });

  if (data?.success) {
    const urlGetUser = new URL(
      `/api/customers/${scope}/byUsername/${username}`,
      api.url
    );
    const { data } = await context.client.get(urlGetUser.href);
    const token = JSON.stringify({ id: data.id, isGuest: false });
    const userToken = CryptoJS.AES.encrypt(token, myAccount.secretPassphrase).toString();

    return userToken;
  }

  return false;
}
