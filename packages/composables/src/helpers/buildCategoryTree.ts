import type { Category } from 'orc-vsf-api';
import { AgnosticCategoryTree } from '@vue-storefront/core';

export const buildCategoryTree = (categories: Category[], rootCategory: string, currentCategory: string, level = -1, withProducts = false): AgnosticCategoryTree => {
  const root: Category = categories?.find(c => c.id === rootCategory);
  if (!root) return null;
  const nextLevel = level > 0 ? (level - 1) : level;

  const children: Category[] = categories.filter(c => c.primaryParentCategoryId === root.id);
  const hasChildren = children.length > 0;
  const isCurrent = root.id === currentCategory;
  const label = root.name;
  const slug = root.id;

  const childrenUid = hasChildren
    ? children
      .reduce((acc, curr) => [...acc, curr.id], [])
    : [];

  const childProductCount = hasChildren
    ? children
      .reduce((acc, curr) => acc + curr.productsCount, 0)
    : 0;

  const items = hasChildren && level !== 0
    ? children
      .filter((c) => (withProducts ? c.productsCount > 0 : true))
      .map((c) => buildCategoryTree(categories, c.id, currentCategory, nextLevel))
    : [];

  return {
    label,
    slug,
    uid: [root.id, ...childrenUid],
    items: items,
    count: childProductCount || root.productsCount,
    isCurrent
  };
};
