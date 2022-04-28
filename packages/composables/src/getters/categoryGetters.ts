import { CategoryGetters, AgnosticCategoryTree, AgnosticBreadcrumb } from '@vue-storefront/core';
import type { Category } from '@vue-storefront/orc-vsf-api';
import { buildCategoryTree } from '../helpers/buildCategoryTree';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTree(categories: Category[]): AgnosticCategoryTree {
  if (!categories) {
    return null;
  }
  return buildCategoryTree(categories, 'Root', '');
}

function getCategoryTree(
  categories: Category[],
  currentCategory = '',
  level: -1,
  withProducts = false
): AgnosticCategoryTree | null {
  return categories
    ? buildCategoryTree(categories, 'Root', currentCategory, level)
    : null;
}

function getBreadcrumbs(categories: Category[], currentCategory?: string): AgnosticBreadcrumb[] {
  let breadcrumbs = [];

  if (!categories || !currentCategory) {
    return [];
  }

  let findCategory = (id: string) => {
    let category = categories.find(c => c.id === id);
    if (category) {
      breadcrumbs.push({
        text: category.name,
        link: `/c/${category.id}`
      } as AgnosticBreadcrumb);
      if (category.primaryParentCategoryId !== 'Root') {
        findCategory(category.primaryParentCategoryId);
      }
    }
  }

  findCategory(currentCategory);

  return breadcrumbs.reverse();
}

export const categoryGetters: CategoryGetters<Category[]> = {
  getTree,
  getBreadcrumbs,
  getCategoryTree
};
