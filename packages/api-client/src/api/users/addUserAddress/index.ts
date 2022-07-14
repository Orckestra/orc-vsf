
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function addUserAddress(context, params) {

  const { api, scope } = context.config;
  const { address } = params;
  const { id, isGuest } = context.config.auth.getCustomerToken();;

  if (id && !isGuest) {
    const url = new URL(
      `/api/customers/${scope}/${id}/addresses`,
      api.url
    );

    const { data } = await context.client.post(url.href, address);
    return data;
  }

  return null;
}
