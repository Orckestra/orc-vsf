import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function changePassword(context, params) {
  const { userToken, currentPassword, newPassword } = params;
  const { api, scope, myAccount } = context.config;
  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;

  let url = new URL(`/api/customers/${scope}/${customerId}`, api.url);
  const { data: currentUser } = await context.client.get(url.href);

  url = new URL(
    `api/membership/${scope}/changepassword/${currentUser.username}`,
    api.url
  );
  const body = {
    newPassword,
    oldPassword: currentPassword
  };
  const { data } = await context.client.post(url.href, body, {
    validateStatus: (status) => {
      return status >= 200 && status <= 500;
    }
  });
  return data;
}
