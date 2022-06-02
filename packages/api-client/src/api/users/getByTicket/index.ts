/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function getByTicket(context, params) {
  const { ticket } = params;
  const { api } = context.config;
  const url = new URL(`/api/customers/byTicket?ticket=${ticket}`, api.url);
  const { data } = await context.client.get(url.href);
  return data;
}

