/* eslint-disable @typescript-eslint/no-unused-vars */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function findStores(context, params) {

  const { api, scope } = context.config;
  const { locale, page = 1, itemsPerPage = 12 } = params;
  const maximumItems = itemsPerPage;
  const startingIndex = (page - 1) * maximumItems;

  const url = new URL(
    `/api/stores/${scope}/find`,
    api.url
  );

  const sortings = [
    {
      Direction: 1,
      PropertyName: 'Created'
    }
  ];

  const filters = [
    {
      Not: false,
      Operator: 'Equals',
      Member: 'StoreType',
      Value: 'Physical',
      CustomExpression: null
    },
    {
      Not: false,
      Operator: 'Equals',
      Member: 'IsActive',
      Value: true,
      CustomExpression: null
    }
  ];

  const query = {
    filter: {
      BinaryOperator: 0,
      FilterGroups: {
        BinaryOperator: 1,
        Not: false,
        filters: filters
      },
      Filters: [],
      Not: false
    },
    sortings,
    includeTotalCount: true,
    maximumItems,
    startingIndex
  };

  const body = {
    cultureName: locale,
    query
  };

  const { data } = await context.client.post(url.href, body);

  return data;
}
