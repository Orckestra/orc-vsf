import type { Product } from '@vue-storefront/orc-vsf-api';

export const getSorting = (sortFilter: string): any => {
  const defaultSort = {
    direction: '1',
    propertyName: 'score'
  };
  if (!sortFilter) return [defaultSort];
  const sortOptions = sortFilter.split('-');
  return [{
    direction: sortOptions && sortOptions.length === 2 && sortOptions[1] === 'desc' ? '1' : '0',
    propertyName: sortOptions && sortOptions.length > 0 ? sortOptions[0] : defaultSort.propertyName
  }];
};

export const getRelatedProductsQuery = (merchandiseTypes: string[], product: Product, limit: number, sortings: object): any => {
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
    includeFacets: false,
    maximumItems: limit,
    startingIndex: 0,
    sortings,
    filter: { binaryOperator: 'And',
      filters }
  };

  return query;
};

export const getCatalogActiveProductsQuery = (scope: string, maximumItems: number, startingIndex: number, sortings: object): any => {
  const query = {
    filter: {
      BinaryOperator: 0,
      FilterGroups: [],
      Filters: [
        {
          Not: false,
          Operator: 0,
          Member: 'CatalogId',
          Value: scope,
          CustomExpression: null
        },
        {
          Not: false,
          Operator: 0,
          Member: 'Active',
          Value: 'True',
          CustomExpression: null
        }
      ],
      Not: false
    },
    distinctResults: false,
    includeTotalCount: true,
    maximumItems,
    startingIndex,
    sortings
  };
  return query;
};
