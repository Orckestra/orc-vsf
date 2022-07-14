
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getUserAddresses(context, params) {

  const { api, scope } = context.config;
  const { id, isGuest } = context.config.auth.getCustomerToken();;

  if (id && !isGuest) {
    const url = new URL(
      `/api/customers/${scope}/${id}/addresses`,
      api.url
    );

    const { data } = await context.client.get(url.href);
    return data;
  }

  return null;
}
