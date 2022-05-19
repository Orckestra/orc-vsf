import type { Product } from '@vue-storefront/orc-vsf-api';

export const withVariants = (product: Product): boolean => {
  return Boolean((product.variants && product.variants.length) || product.propertyBag?.VariantId);
};

export const getVariantId = (product: Product): string => {
  return product.variants && product.variants.length ? product.variants[0].id : product.propertyBag?.VariantId;
};
