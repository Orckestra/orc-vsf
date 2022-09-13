import type { Category } from 'orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const buildFacetPredicatesByFilters = (filters: any, config?: any): any => {
  if (!filters) return [];
  const facetPredicates = [];

  Object.keys(filters).forEach(filterKey => {
    const options = filters[filterKey];
    const facetConfig = config.availableFacets.find(f => f.name === filterKey);
    if (!facetConfig) return;
    if (options && options.length) {
      const predicate: any = {
        facetType: facetConfig.type,
        fieldName: filterKey,
        values: filters[filterKey],
        operatorType: 0,
        excludeFilterForFacetsCount: true
      };

      // Range
      if (facetConfig.type === 2) {
        const values = options[0].split('_');
        predicate.values = null,
        predicate.minimumValue = parseFloat(values[0]);
        predicate.maximumValue = parseFloat(values[1]);
      }

      facetPredicates.push(predicate);
    }
  });

  return facetPredicates;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const buildFacetPredicates = (categories: any, rootCategory: string, filters?: any, config?: any): any => {
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

  let facetPredicates = categoryFacets.map((c, index) => ({
    facetType: 1,
    fieldName: `CategoryLevel${index + 1}_Facet`,
    values: [c],
    operatorType: 0,
    excludeFilterForFacetsCount: true
  }));

  facetPredicates = facetPredicates.concat(buildFacetPredicatesByFilters(filters, config));

  return facetPredicates;
};

