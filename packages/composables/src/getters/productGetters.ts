import {
  AgnosticMediaGalleryItem,
  AgnosticAttribute,
  AgnosticPrice,
  ProductGetters
} from '@vue-storefront/core';
import type { Product, ProductPrice, ProductFilter, Metadata, KeyVariantAttributeItem, KeyVariantAttributeItemValue } from '@vue-storefront/orc-vsf-api';

function getProductWithVariant(product: Product, variantId: string): Product {
  if (variantId) {
    const variant = product.variants?.find(v => v.id === variantId);
    if (variant) {
      const variantPrices: any = product.prices?.variantPrices?.find(p => p.variantId === variantId);
      return {
        ...product,
        currentVariantId: variantId,
        ...{ media: variant.media },
        ...{ name: variant.displayName },
        ...{ prices: variantPrices }
      };
    }
  }

  return product;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getName(product: Product): string {
  return product?.name ?? product?.propertyBag?.DisplayName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSlug(product: Product): string {
  return product?.sku;
}

function getBrand(product: Product): string {
  return product?.propertyBag?.Brand;
}

function getPrice(product: Product): AgnosticPrice {
  if (!product) return;

  const prices: ProductPrice = product.prices;
  if (prices) {
    return {
      regular: prices.defaultPrice,
      special: (prices.pricing.price < prices.defaultPrice ? prices.pricing.price : undefined)
    };
  } else {
    return {
      regular: product.regularPrice,
      special: product.currentPrice < product.regularPrice ? product.currentPrice : undefined
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getGallery(product: Product): AgnosticMediaGalleryItem[] {
  if (product?.mediaSet) {
    return product.mediaSet.map(set => {
      return {
        small: set.resizedInstances?.find(i => i.size === 'M')?.url ?? set.url,
        normal: set.resizedInstances?.find(i => i.size === 'L')?.url ?? set.url,
        big: set.resizedInstances?.find(i => i.size === 'XL')?.url ?? set.url
      };
    });
  }

  return product?.media ?? [];
}

function getCoverImage(product: Product): string {
  return product?.coverImage;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFiltered(products: Product[], filters: ProductFilter): Product[] {
  if (!products) {
    return [];
  }
  products = Array.isArray(products) ? products : [products];

  return products.slice(0, 1);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAttributes(products: Product[] | Product, filterByAttributeName?: string[]): Record<string, AgnosticAttribute | string> {
  return {};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSelectedKvas(product: Product, variantId?: string): Record<string, AgnosticAttribute | string> {
  if (variantId && product.variants) {
    return product.variants.find(v => v.id === variantId)?.propertyBag;
  }
  return {};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDescription(product: Product): string {
  return product?.description;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCategoryIds(product: Product): string[] {
  return product?.parentCategoryIds ?? [];
}

function getId(product: Product): string {
  return product?.productId;
}

function getVariantId(product: Product): string {
  return product?.propertyBag?.VariantId;
}

function getLink(product: Product): string {
  if (!product) return;
  const variantId = product.propertyBag?.VariantId;

  return `/p/${product.productId}/${product.propertyBag?.ProductDisplayName}${variantId ? `?variant=${variantId}` : ''}`;
}

function getKvaItems(product: Product, metadata: Metadata, locale: string, selectedVariantId?: string): KeyVariantAttributeItem[] {
  if (!product?.variants) return;

  const definition = metadata.definitions.find(d => d.name === product.definitionName);

  if (!definition?.variantProperties) return;
  const keyVariantProperties = definition.variantProperties.filter(v => v.isKeyVariant);
  if (!keyVariantProperties || !keyVariantProperties.length) return;

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const selectedKvas = selectedVariant ? selectedVariant.propertyBag : {};
  const activeVariants = product.variants.filter(v => v.active && v.propertyBag);

  const result = keyVariantProperties.map(pr => {
    const selectedPrValue = selectedKvas[pr.propertyName];
    const prValues: KeyVariantAttributeItemValue[] = [];
    const prLookup = pr.dataType === 'Lookup' ? metadata.lookups.find(l => l.lookupName === pr.propertyName) : undefined;

    activeVariants.forEach(v => {
      const prValue = v.propertyBag[pr.propertyName];
      const lookupValue = prLookup?.values?.find(v => v.value === prValue);

      if (prValue && !prValues.find(pr => pr.value === prValue)) {
        const relatedVariants = activeVariants.filter(v => v.propertyBag[pr.propertyName] === prValue);

        prValues.push({
          value: prValue,
          selected: selectedPrValue === prValue,
          disabled: isDisabled(pr, relatedVariants),
          title: lookupValue?.displayName?.[locale] ?? prValue,
          relatedVariantIds: relatedVariants.map(v => v.id)
        });
      }
    });

    return {
      values: prValues,
      title: pr.displayName,
      propertyName: pr.propertyName,
      propertyDataType: pr.dataType
    };
  });

  return result;

  function isDisabled(pr, relatedVariants) {
    const otherKeyProps = keyVariantProperties.filter(p => p.propertyName !== pr.propertyName);
    let disabled = false;
    otherKeyProps.forEach(otherP => {
      const selectedOtherPrValue = selectedKvas[otherP.propertyName];
      if (selectedOtherPrValue) {
        const findRelatedWithSelected = relatedVariants.find(v => v.propertyBag[otherP.propertyName] === selectedOtherPrValue);
        if (!findRelatedWithSelected) {
          disabled = true;
        }
      }
    });

    return disabled;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFormattedPrice(price: number): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotalReviews(product: Product): number {
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAverageRating(product: Product): number {
  return 0;
}

export const productGetters: ProductGetters<Product, ProductFilter> = {
  getProductWithVariant,
  getName,
  getSlug,
  getPrice,
  getBrand,
  getGallery,
  getCoverImage,
  getFiltered,
  getAttributes,
  getSelectedKvas,
  getDescription,
  getCategoryIds,
  getId,
  getVariantId,
  getLink,
  getFormattedPrice,
  getTotalReviews,
  getAverageRating,
  getKvaItems
};
