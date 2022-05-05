import type { Category } from '@vue-storefront/orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const buildFacetPredicates = (categories: any, rootCategory: string): any => {
  if (!Array.isArray(categories)) return [];
  const root: Category = categories.find(c => c.id === rootCategory);
  if (!root) return [];

  const getAncestorsAndSelfCategoriesAsync = (current: Category) => {
    const result: string[] = [];
    while (current && current.id !== 'Root') {
      result.push(current.name);
      current = categories.find(c => c.id === current.primaryParentCategoryId);
    }
    return result.reverse();
  };

  const categoryFacets = getAncestorsAndSelfCategoriesAsync(root);

  const facetPredicates = categoryFacets.map((c, index) => ({
    facetType: 1,
    fieldName: `CategoryLevel${index + 1}_Facet`,
    values: [c],
    operatorType: 0,
    excludeFilterForFacetsCount: true
  }));

  return facetPredicates;
};
