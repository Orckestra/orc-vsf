import { AgnosticBreadcrumb, AgnosticCategoryTree, AgnosticFilter, AgnosticMediaGalleryItem, AgnosticPagination, AgnosticPrice, AgnosticSort, UseSearchGetters } from '@vue-storefront/core';
import { buildCategoryTree } from '../helpers/buildCategoryTree';
import type { SearchResults, Category } from '@vue-storefront/orc-vsf-api';
import { setProductCounts } from '../helpers/categoriesUtils';

function getItems(result: SearchResults): any {
  return result?.products;
}

function getCategoryTree(result: SearchResults): AgnosticCategoryTree {
  const categories = result?.categories;
  const categoryCounts = result?.facetCounts;
  setProductCounts(categories, categoryCounts);
  return buildCategoryTree(categories, 'Root', '', 3, true);
}

function getCategorySuggestions(result: SearchResults, categories: Category[], term: string): AgnosticCategoryTree[] {
  result.categories = categories;
  const categoryTree = getCategoryTree(result);
  const suggestions: AgnosticCategoryTree[] = [];

  const getSuggestedNode = (node: AgnosticCategoryTree) => {
    if (!node) return;
    if (node.label?.toLowerCase().indexOf(term?.toLowerCase()) > -1) {
      suggestions.push(node);
    }
    if (node.items?.length) {
      for (const child of node.items) {
        getSuggestedNode(child);
      }
    }
  };

  getSuggestedNode(categoryTree);

  return suggestions;
}

function getPagination(): AgnosticPagination {
  throw new Error('Function not implemented.');
}

function getItemPrice(): AgnosticPrice {
  throw new Error('Function not implemented.');
}

function getSortOptions(): AgnosticSort {
  throw new Error('Function not implemented.');
}

function getBreadcrumbs(): AgnosticBreadcrumb[] {
  throw new Error('Function not implemented.');
}

function getItemImages(): AgnosticMediaGalleryItem[] {
  throw new Error('Function not implemented.');
}

function getFilters(): AgnosticFilter[] {
  throw new Error('Function not implemented.');
}

function getItemName(): string {
  throw new Error('Function not implemented.');
}

function getItemId(): string {
  throw new Error('Function not implemented.');
}

function getItemSlug(): string {
  throw new Error('Function not implemented.');
}

export const searchGetters: (UseSearchGetters<SearchResults, any> & { [getterName: string]: any }) = {
  getItems,
  getCategoryTree,
  getCategorySuggestions,
  getPagination,
  getItemPrice,
  getSortOptions,
  getBreadcrumbs,
  getItemImages,
  getFilters,
  getItemName,
  getItemId,
  getItemSlug
};
