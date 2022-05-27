// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function login(context, params) {

  const { api, scope } = context.config;
  const { password, username } = params;
  const url = new URL(
    `/api/membership/${scope}/Login`,
    api.url
  );
  const { data } = await context.client.put(url.href, {
    password,
    username
  });

  return data;
}
