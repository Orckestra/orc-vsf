// import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getOrders(context, params) {
  const { api, scope, myAccount } = context.config;
  const { userToken, locale, orderTense, page = 1, itemsPerPage } = params;
  const maximumItems = itemsPerPage;
  const startingIndex = (page - 1) * maximumItems;
  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;

  const url = new URL(
    `/api/orders/${scope}/find`,
    api.url
  );

  const filters =
    orderTense === 0
      ? [{
        Not: false,
        Operator: 'Equals',
        Member: 'OrderStatus',
        Value: 'Canceled',
        CustomExpression: null
      },
      {
        Not: false,
        Operator: 'Equals',
        Member: 'OrderStatus',
        Value: 'Completed',
        CustomExpression: null
      },
      {
        Not: false,
        Operator: 'Equals',
        Member: 'OrderStatus',
        Value: 'Shipped',
        CustomExpression: null
      }] : [
        {
          Not: false,
          Operator: 'Equals',
          Member: 'OrderStatus',
          Value: 'InProgress',
          CustomExpression: null
        },
        {
          Not: false,
          Operator: 'Equals',
          Member: 'OrderStatus',
          Value: 'PendingProcess',
          CustomExpression: null
        },
        {
          Not: false,
          Operator: 'Equals',
          Member: 'OrderStatus',
          Value: 'PartiallyFulfilled',
          CustomExpression: null
        },
        {
          Not: false,
          Operator: 'Equals',
          Member: 'OrderStatus',
          Value: 'New',
          CustomExpression: null
        }];

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
    Sortings: [
      {
        Direction: 1,
        PropertyName: 'Created'
      }
    ],
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
