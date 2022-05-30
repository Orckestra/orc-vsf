/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function resetPassword(context, params) {
    const { email, password, passwordAnswer, username } = params;
    const { api, scope } = context.config;
    const url = new URL(`/api/membership/${scope}/resetPassword`, api.url);
    const { data } = await context.client.post(url.href, {
      email,
      username,
      passwordAnswer,
      password
    });
    return data;
  }