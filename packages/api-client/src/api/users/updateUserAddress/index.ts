// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updateUserAddress(context, params) {

  const { api } = context.config;
  const { address, addressId } = params;
  const { id, isGuest } = context.config.auth.getCustomerToken();;

  if (id && !isGuest) {
    const url = new URL(
      `/api/customers/${id}/addresses/${addressId}`,
      api.url
    );

    const { data } = await context.client.put(url.href, address);
    return data;
  }

  return null;
}
