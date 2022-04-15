/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomQuery } from '@vue-storefront/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getProduct(
  context,
  params,
  customQuery?: CustomQuery
) {
  const url = new URL(
    `/api/search/${context.config.scope}/en-CA/availableProducts`,
    context.config.api.url
  );

  const { data } = await context.client.post(url.href, {
    query: {
      distinctResults: true,
      maximumItems: 12,
      startingIndex: 0,
    },
  });
  return data.documents;
}
