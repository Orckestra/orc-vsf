/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function findInventoryItemStatus(
  context,
  params
) {
  const { skus, inventoryLocationId, date = Date.now } = params;
  const { api, scope } = context.config;
  const url = new URL(
    `/api/inventoryItems/${scope}/byLocation/${inventoryLocationId}/bySkus/status`,
    api.url
  );

  const { data } = await context.client.post(url.href, {
    date,
    skus
  });

  return data;
}
