import { CategoryGetters, AgnosticCategoryTree, AgnosticBreadcrumb } from '@vue-storefront/core';
import type { Category } from 'orc-vsf-api';
import { buildCategoryTree } from '../helpers/buildCategoryTree';
import { setProductCounts } from '../helpers/categoriesUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTree(categories: Category[]): AgnosticCategoryTree {
  if (!categories) {
    return null;
  }
  return buildCategoryTree(categories, 'Root', '');
}

function getCategoryTree(
  categories: Category[],
  categoryCounts = null,
  currentCategory = '',
  level: -1
): AgnosticCategoryTree | null {
  const counts = categoryCounts?.facetCounts;
  if (counts) {
    setProductCounts(categories, counts);
  }
  return categories
    ? buildCategoryTree(categories, 'Root', currentCategory, level, counts !== null)
    : null;
}

function getBreadcrumbs(categories: Category[], currentCategory?: string, includeHome = true): AgnosticBreadcrumb[] {
  const breadcrumbs = [];

  if (!categories || !currentCategory) {
    return [];
  }
  let category = categories.find(c => c.id === currentCategory);
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

export const categoryGetters: CategoryGetters<Category[]> = {
  getTree,
  getBreadcrumbs,
  getCategoryTree
};
