import { AgnosticBreadcrumb, AgnosticCategoryTree, AgnosticFilter, AgnosticMediaGalleryItem, AgnosticPagination, AgnosticPrice, AgnosticSort, UseSearchGetters } from '@vue-storefront/core';
import { buildCategoryTree } from '../helpers/buildCategoryTree';
import type { SearchResults } from '@vue-storefront/orc-vsf-api';
import { setProductCounts } from '../helpers/categoriesUtils';

function getItems(result: SearchResults): any {
  return result?.products;
}

function getCategoryTree(result: SearchResults): AgnosticCategoryTree {
  const categories = result?.categories;
  const categoryCounts = result?.categoryCounts;
  setProductCounts(categories, categoryCounts);
  return buildCategoryTree(categories, 'Root', '', 3, true);
}

function getPagination(result: SearchResults): AgnosticPagination {
  throw new Error('Function not implemented.');
}

function getItemPrice(item: any): AgnosticPrice {
  throw new Error('Function not implemented.');
}

function getSortOptions(result: SearchResults): AgnosticSort {
  throw new Error('Function not implemented.');
}

function getBreadcrumbs(result: SearchResults): AgnosticBreadcrumb[] {
  throw new Error('Function not implemented.');
}

function getItemImages(item: any): AgnosticMediaGalleryItem[] {
  throw new Error('Function not implemented.');
}

function getFilters(result: SearchResults): AgnosticFilter[] {
  throw new Error('Function not implemented.');
}

function getItemName(item: any): string {
  throw new Error('Function not implemented.');
}

function getItemId(item: any): string {
  throw new Error('Function not implemented.');
}

function getItemSlug(item: any): string {
  throw new Error('Function not implemented.');
}

export const searchGetters: UseSearchGetters<SearchResults, any> = {
  getItems,
  getCategoryTree,
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
