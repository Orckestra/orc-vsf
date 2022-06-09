// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function changePassword(context, params) {
  const { currentUser, currentPassword, newPassword } = params;
  const { api, scope } = context.config;
  const url = new URL(
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
