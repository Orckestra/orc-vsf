import CryptoJS from 'crypto-js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function login(context, params) {

  const { api, scope, myAccount } = context.config;
  const { password, username } = params;
  if (myAccount.secretPassphrase === undefined || myAccount.secretPassphrase === '') {
    console.error('Secret Passphrase is not configured. For security purpose it is important to configure Secret Passphrase.');
    return {errorMessage: 'Secret passphrase is not configured.'};
  }

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

    return { userToken };
  }

  return {};
}
