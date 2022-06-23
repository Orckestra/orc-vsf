
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getUser(context, params) {

  console.log('getUser10')
  const { api, scope, auth } = context.config;
  const { id, isGuest } = auth.getCustomerToken();

  console.log('getUser20')

  if (id && !isGuest) {
    const url = new URL(
      `/api/customers/${scope}/${id}`,
      api.url
    );

    console.log('getUser30')

    const { data } = await context.client.get(url.href);

    console.log('getUser40')
    return data;
  }

  return null;
}
