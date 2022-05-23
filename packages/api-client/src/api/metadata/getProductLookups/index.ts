// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getProductLookups(context, params) {
  const { api } = context.config;
  const url = new URL(`/api/metadata/lookups/product`, api.url);
  const { data } = await context.client.get(url.href);
  return data;
}
