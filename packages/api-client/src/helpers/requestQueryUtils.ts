import type { Product } from '@vue-storefront/orc-vsf-api';

export const getRelatedProductsQuery = (merchandiseTypes: string[], product: Product, categoryId: string, limit: any, sort: any): any => {
    const relatedProductIds = product?.relationships?.filter(el => merchandiseTypes.indexOf(el.merchandiseType) > -1 ).map(item => item?.entityId);
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
}