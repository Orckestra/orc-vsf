
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getUser(context, params) {

  const { api, scope, auth } = context.config;
  const { id, isGuest } = auth.getCustomerToken();

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
