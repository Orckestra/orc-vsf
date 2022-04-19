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
  const { id, catId } = params;
  let url = null;
  console.log('I am in getProduct');
  console.log(params);

  if (id) {
    console.log('Product Details');

    url = new URL(
      `/api/products/v2/${context.config.scope}/${id}?CultureName=en-CA&IncludeMedia=true&IncludeVariants=true&IncludeImageUrl=true`,
      context.config.api.url
    );

    const { data } = await context.client.get(url.href);

    console.log(data);

    return { ...data, name: 'Test Name' };

  } else if (catId) {
    console.log('TODO: Related');
    return [];
  } else {

    url = new URL(
      `/api/search/${context.config.scope}/en-CA/availableProducts`,
      context.config.api.url
    );

    const { data } = await context.client.post(url.href, {
      query: {
        distinctResults: true,
        maximumItems: 12,
        startingIndex: 0
      }
    });

    return data.documents ?? [];
  }
}
