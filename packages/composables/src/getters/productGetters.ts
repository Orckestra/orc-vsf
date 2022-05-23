import {
  AgnosticMediaGalleryItem,
  AgnosticAttribute,
  AgnosticPrice,
  ProductGetters
} from '@vue-storefront/core';
import type { Product, ProductFilter, Metadata, KeyVariantAttributeItem, KeyVariantAttributeItemValue } from '@vue-storefront/orc-vsf-api';

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

  const prices = product.prices;
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
  return [
    {
      small: 'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081223_1_large.jpg',
      normal: 'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081223_1_large.jpg',
      big: 'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081223_1_large.jpg'
    }
  ];
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
  if(variantId && product.variants) {
    return product.variants.find(v=>v.id === variantId)?.propertyBag;
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


function getKvaItems(product: Product, metadata: Metadata): KeyVariantAttributeItem[] {
  if(!product?.variants) return;
  const definition = metadata.definitions.find(d=> d.name === product.definitionName);
  if(!definition?.variantProperties) return;

  const keyVariantProperties = definition.variantProperties.filter(v=> v.isKeyVariant);
  var activeVariants = product.variants.filter(v=> v.active && v.propertyBag);

  let result = keyVariantProperties.map(pr => {
    let prValues: KeyVariantAttributeItemValue[] = [];
    let relatedVariantIds = [];
    activeVariants.forEach(v => {
      let prValue = v.propertyBag[pr.propertyName];
      if (prValue) {
        relatedVariantIds.push(v.id);
      }
      if (prValue && !prValues.find(pr => pr.value === prValue)) {
        prValues.push({
          value: prValue,
          selected: false,
          disabled: false,
          title: prValue,
          relatedVariantIds
        });
      }
    });

    return {
      values: prValues,
      title: pr.displayName,
      propertyName: pr.propertyName,
      propertyDataType: pr.dataType
    }
  });

  return result
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
