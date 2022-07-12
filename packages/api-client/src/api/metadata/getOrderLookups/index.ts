// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getOrderLookups(context) {
    const { api } = context.config;
    const url = new URL('/api/metadata/lookups/order', api.url);
    const { data } = await context.client.get(url.href);
    return data;
  }
  