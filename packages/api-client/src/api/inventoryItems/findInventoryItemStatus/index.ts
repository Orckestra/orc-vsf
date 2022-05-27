/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function findInventoryItemStatus(
  context,
  params
) {
  const { skus, inventoryLocationId, date } = params;
  const { api, scope, inventoryLocationIds } = context.config;

  const url = new URL(
    `/api/inventoryItems/${scope}/byLocation/${inventoryLocationId ? inventoryLocationId : inventoryLocationIds.split(',')?.[0]}/bySkus/status`,
    api.url
  );

  const dateNow = new Date();
  const { data } = await context.client.post(url.href, {
    date: date ? date : dateNow.toISOString(),
    skus
  });

  return data;
}
