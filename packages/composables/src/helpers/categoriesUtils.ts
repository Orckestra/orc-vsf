import type { Category } from 'orc-vsf-api';

export const getCategoryLevel = (categories: Category[], currentCatId: string): number => {
  let level = 1;
  let currentCat: Category = categories.find(c => c.id === currentCatId);

  while (currentCat && currentCat.id !== 'Root') {
    currentCat = categories.find(c => c.id === currentCat.primaryParentCategoryId);
    level++;
  }

  return level;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setProductCounts = (categories: Category[], counts: any): void => {
  if (!categories || !counts || !Array.isArray(counts)) return;

  const allCountValues = counts.flatMap(c => c.values);

  categories.forEach(cat => {
    const count = allCountValues.find(c => c.value.toLowerCase() === cat.id.toLowerCase());
    cat.productsCount = count ? count.count : 0;
  });
};
