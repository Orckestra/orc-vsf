// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getOrderByNumber(context, params) {

  const { api, scope } = context.config;
  const { orderNumber } = params;

  const url = new URL(
    `/api/orders/${scope}/byNumber/${orderNumber}`,
    api.url
  );

  const { data } = await context.client.get(url.href);
  return data;
}
