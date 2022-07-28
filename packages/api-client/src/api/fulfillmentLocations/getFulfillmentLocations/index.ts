// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getFulfillmentLocations(context, params) {
  const { api, scope, inventoryLocationIds } = context.config;
  const { includeChildScopes, onlyActive, isInventoryLocation = false, includeSchedules = false } = params;

  const url = new URL(
    `/api/fulfillmentLocations/${scope}?IncludeChildScopes=${includeChildScopes}&OnlyActive=${onlyActive}&IncludeSchedules=${includeSchedules}`,
    api.url
  );

  let { data } = await context.client.get(url.href);

  if (data && inventoryLocationIds && isInventoryLocation) {
    const locationIds = inventoryLocationIds.split(',');
    data = data.filter(d => locationIds.includes(d.inventoryLocationId));

  }
  return data;
}

