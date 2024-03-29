// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getFulfillmentLocations(context, params) {
  const { api, scope } = context.config;
  const { includeChildScopes, onlyActive, includeSchedules = false } = params;

  const url = new URL(
    `/api/fulfillmentLocations/${scope}?IncludeChildScopes=${includeChildScopes}&OnlyActive=${onlyActive}&IncludeSchedules=${includeSchedules}`,
    api.url
  );

  const { data } = await context.client.get(url.href);

  return data;
}

