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
import type { Facet, FacetSearchCriteria } from '@vue-storefront/orc-vsf-api';
import { buildCategoryTree } from '../helpers/buildCategoryTree';
import { setProductCounts } from '../helpers/categoriesUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAll(params: FacetSearchResult<Facet>, criteria?: FacetSearchCriteria): AgnosticFacet[] {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getGrouped(params: FacetSearchResult<Facet>, criteria?: FacetSearchCriteria): AgnosticGroupedFacet[] {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSortOptions(params: FacetSearchResult<Facet>): AgnosticSort {
  return {
    options: [{type: '', id: 'CurrentPrice-desc', value: 'Price from low to high'},
     {type: '', id: 'CurrentPrice-asc', value: 'Price from high to low'},
     {type: '', id: 'DisplayName_Sort-desc', value: 'Name A-Z'},
     {type: '', id: 'DisplayName_Sort-asc', value: 'Name Z-A'},
     {type: '', id: 'score', value: 'Latest'}],
    selected: params.input.sort
  };
}

function getCategoryTree(params: FacetSearchResult<Facet>, root = 'Root', level = 3): AgnosticCategoryTree {
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
function getProducts(params: FacetSearchResult<Facet>): any {
  return params.data?.products;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPagination(params: FacetSearchResult<Facet>): AgnosticPagination {
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
function getBreadcrumbs(params: FacetSearchResult<Facet>, includeHome = true): AgnosticBreadcrumb[] {
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

export const facetGetters: FacetsGetters<Facet, FacetSearchCriteria> = {
  getSortOptions,
  getGrouped,
  getAll,
  getProducts,
  getCategoryTree,
  getBreadcrumbs,
  getPagination
};
