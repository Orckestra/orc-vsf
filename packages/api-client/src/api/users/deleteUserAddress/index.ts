
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function deleteUserAddress(context, params) {
  const { api } = context.config;
  const { addressId } = params;
  const { id, isGuest } = context.config.auth.getCustomerToken();

  if (id && !isGuest) {
    const url = new URL(
      `/api/addresses/${addressId}`,
      api.url
    );

    const { data } = await context.client.delete(url.href);
    return data;
  }

  return null;
}
