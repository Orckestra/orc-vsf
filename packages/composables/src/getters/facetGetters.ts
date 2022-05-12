import {
  FacetsGetters,
  FacetSearchResult,
  AgnosticCategoryTree,
  AgnosticGroupedFacet,
  AgnosticPagination,
  AgnosticSort,
  AgnosticBreadcrumb,
  AgnosticFacet
} from '@vue-storefront/core';
import type { SearchResults, FacetSearchCriteria, Facet } from '@vue-storefront/orc-vsf-api';
import { buildCategoryTree } from '../helpers/buildCategoryTree';
import { setProductCounts } from '../helpers/categoriesUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAll(params: FacetSearchResult<SearchResults>, criteria?: FacetSearchCriteria): AgnosticFacet[] {
  return [];
}

function getGrouped(params: FacetSearchResult<SearchResults>, criteria?: string[]): (AgnosticGroupedFacet & {type: string})[] {
  let facets = params.data?.facets;
  const filters = params.input?.filters;
  if (!facets) return;

  const getMetadata = (facet: Facet) => {
    return {
      startValue: facet.startValue,
      endValue: facet.endValue,
      gapSize: facet.gapSize
    };
  };

  if (criteria) {
    facets = facets.filter(f => criteria.includes(f.fieldName));
  }

  return facets.map(facet => {
    const selectedList = filters && filters[facet.fieldName] ? filters[facet.fieldName] : [];
    return {
      id: facet.fieldName,
      label: facet.title,
      type: facet.facetType,
      options: facet.values.map((v) =>
        ({
          id: v.value,
          value: v.value,
          type: facet.facetType,
          count: v.count,
          selected: selectedList.includes(v.value),
          metadata: getMetadata(facet)
        }))
    };
  }).filter(i => i && i.options && i.options.length);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSortOptions(params: FacetSearchResult<SearchResults>): AgnosticSort {
  return {
    options: [{ type: 'sort', id: 'score-desc', value: 'Relevance' },
      { type: 'sort', id: 'CurrentPrice-asc', value: 'Price from low to high' },
      { type: 'sort', id: 'CurrentPrice-desc', value: 'Price from high to low' },
      { type: 'sort', id: 'DisplayName_Sort-asc', value: 'Name A-Z' },
      { type: 'sort', id: 'DisplayName_Sort-desc', value: 'Name Z-A' }],
    selected: params.input.sort
  };
}

function getCategoryTree(params: FacetSearchResult<SearchResults>, root = 'Root', level = 3): AgnosticCategoryTree {
  if (!params.data) return;

  const { categoryCounts } = params.data;
  const { categorySlug, withCategoryCounts } = params.input;
  const categories = params.data?.categories;
  if (withCategoryCounts) {
    setProductCounts(categories, categoryCounts);
  }

  return buildCategoryTree(categories, root, categorySlug, level);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProducts(params: FacetSearchResult<SearchResults>): any {
  return params.data?.products;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPagination(params: FacetSearchResult<SearchResults>): AgnosticPagination {
  const { data, input } = params;
  if (!data) return;
  return {
    currentPage: input.page,
    totalPages: Math.floor(data.total / input.itemsPerPage),
    totalItems: data.total,
    itemsPerPage: input.itemsPerPage,
    pageOptions: [12, 24, 48]
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getBreadcrumbs(params: FacetSearchResult<SearchResults>, includeHome = true): AgnosticBreadcrumb[] {
  const breadcrumbs = [];
  if (!params.data) {
    return breadcrumbs;
  }
  const { categorySlug } = params.input;
  const categories = params.data?.categories;
  let category = categories.find(c => c.id === categorySlug);
  while (category && category.id !== 'Root') {
    breadcrumbs.push({
      text: category.name,
      link: `/c/${category.id}`
    } as AgnosticBreadcrumb);
    category = categories.find(c => c.id === category.primaryParentCategoryId);
  }

  if (includeHome) {
    return [
      { text: 'Home', link: '/' },
      ...breadcrumbs.reverse()
    ];
  }

  return breadcrumbs.reverse();
}

export const facetGetters: FacetsGetters<SearchResults, FacetSearchCriteria> = {
  getSortOptions,
  getGrouped,
  getAll,
  getProducts,
  getCategoryTree,
  getBreadcrumbs,
  getPagination
};
