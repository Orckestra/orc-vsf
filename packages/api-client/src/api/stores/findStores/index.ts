/* eslint-disable @typescript-eslint/no-unused-vars */
const getCachedShedules = async (context, params) => {
  const { api, scope } = context.config;
  const cacheKey = `Shedules|${scope}`;
  const value = context.cache?.get(cacheKey);
  if (value !== undefined) {
    return value;
  }

  const url = new URL(`/api/fulfillmentLocations/${scope}?IncludeSchedules=true`, api.url);
  const { data } = await context.client.get(url.href);

  const schedules = data.reduce((acc, rec) => ({ ...acc, [rec.id]: rec.schedules }), {});

  context.cache?.set(cacheKey, schedules, 300);

  return schedules;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function findStores(context, params) {
  const { api, scope } = context.config;
  const { locale, page = 1, itemsPerPage = 1000, sorting } = params;
  const maximumItems = itemsPerPage;
  const startingIndex = (page - 1) * maximumItems;

  const url = new URL(`/api/stores/${scope}/find`, api.url);

  const sortings = !sorting
    ? [
        {
          Direction: 0,
          PropertyName: 'Name'
        }
      ]
    : sorting;

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

  const schedules = await getCachedShedules(context, {});

  const getSchedule = (fullfillmentId, scheduleType) => schedules[fullfillmentId]?.find((d) => d.scheduleType === scheduleType);

  return {
    ...data,
    results: data.results?.map((result) => ({
      ...result,
      deliverySchedule: getSchedule(result.id, 'Delivery'),
      pickUpSchedule: getSchedule(result.id, 'Pickup'),
      storeSchedule: getSchedule(result.id, 'OpeningHours')
    }))
  };
}
