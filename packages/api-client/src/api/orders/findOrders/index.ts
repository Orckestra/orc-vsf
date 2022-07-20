// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function findOrders(context, params) {
  const { api, scope, myAccount } = context.config;
  const { userToken, locale, page = 1, itemsPerPage = 12, filterValues, filterMember, sorting } = params;
  const maximumItems = itemsPerPage;
  const startingIndex = (page - 1) * maximumItems;
  const { id: customerId } = context.config.auth.getCustomerToken();
  if (!customerId) return null;

  const url = new URL(
    `/api/orders/${scope}/find`,
    api.url
  );

  const sortings = !sorting ? [
    {
      Direction: 1,
      PropertyName: 'Created'
    }
  ] : sorting;

  const filters = filterValues.map(item => ({
    Not: false,
    Operator: 'Equals',
    Member: filterMember,
    Value: item,
    CustomExpression: null
  }));

  const query = {
    filter: {
      BinaryOperator: 0,
      FilterGroups: {
        BinaryOperator: 1,
        Not: false,
        filters
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
    customerId,
    cultureName: locale,
    includeFulfillmentStates: true,
    query
  };
  const { data } = await context.client.post(url.href, body);
  return data;

}
