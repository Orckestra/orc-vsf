/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function getConfiguration(context) {
  const { api } = context.config;
  const url = new URL('/api/membership/configuration', api.url);
  const { data } = await context.client.get(url.href);
  return data;
}

