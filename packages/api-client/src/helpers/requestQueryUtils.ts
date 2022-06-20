import type { Product } from '@vue-storefront/orc-vsf-api';

export const getRelatedProductsQuery = (merchandiseTypes: string[], product: Product, limit: number, sort: object): any => {
  const relatedProductIds = product?.relationships?.filter(el => merchandiseTypes.indexOf(el.merchandiseType) > -1).map(item => item?.entityId);
  const filters = relatedProductIds
    ? [{
      member: 'ProductId',
      CustomExpression: relatedProductIds.map(item => `ProductId:${item}`).join(' OR '),
      operator: 'Custom'
    }]
    : [{
      member: 'ParentCategoryId',
      value: product.parentCategoryIds[0]
    },
    {
      member: 'ProductId',
      value: product.id,
      not: true
    }];
  const query = {
    distinctResults: true,
    includeTotalCount: false,
    maximumItems: limit,
    startingIndex: 0,
    sortings: [sort],
    filter: { binaryOperator: 'And',
      filters }
  };

  return query;
};

export const getCatalogActiveProductsQuery = (scope: string, maximumItems, startingIndex, sortings): any => {
  const query = {
    filter: {
      "BinaryOperator": 0,
      "FilterGroups": [],
      "Filters": [
        {
          "Not": false,
          "Operator": 0,
          "Member": "CatalogId",
          "Value": scope,
          "CustomExpression": null
        },
        {
          "Not": false,
          "Operator": 0,
          "Member": "Active",
          "Value": "True",
          "CustomExpression": null
        }
      ],
      "Not": false
    },
    distinctResults: false,
    includeTotalCount: true,
    maximumItems,
    startingIndex,
    sortings
  }
  return query;
};
