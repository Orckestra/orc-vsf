import {
  WishlistGetters,
  AgnosticAttribute,
  AgnosticPrice,
  AgnosticTotals
} from '@vue-storefront/core';
import type { Wishlist, WishlistItem } from 'orc-vsf-api';
import { getTotalPrices } from '../helpers/wishlistUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItems(wishlist: Wishlist): WishlistItem[] {
  return wishlist?.items;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotals(wishlist: Wishlist): AgnosticTotals {
  return getTotalPrices(wishlist?.items);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemName(item: WishlistItem): string {
  return item?.productSummary.displayName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemImage(item: WishlistItem): string {
  return item.coverImage;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemPrice(item: WishlistItem): AgnosticPrice {
  return {
    regular: item.regularPrice,
    special: item.currentPrice < item.regularPrice ? item.currentPrice : undefined
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemQty(item: WishlistItem): number {
  return 1;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemAttributes(item: WishlistItem, filters?: string[]): Record<string, AgnosticAttribute | string> {
  if (!item.kvaDisplayValues) return null;
  const result = {
    ...item?.kvaDisplayValues
  };

  if (filters) {
    Object.keys(result).forEach(key => {
      if (!filters.includes(key)) {
        delete result[key];
      }
    });
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemSku(item: WishlistItem): string {
  return item.sku;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShippingPrice(wishlist: Wishlist): number {
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotalItems(wishlist: Wishlist): number {
  return wishlist?.items?.length;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFormattedPrice(price: number): string {
  return '';
}

function getLink(item: WishlistItem): string {
  if (!item) return;
  const variantId = item.variantId;
  const productId = item.productId;

  return `/p/${productId}/${item?.productSummary.displayName}${variantId ? `?variant=${variantId}` : ''}`;
}

export const wishlistGetters: WishlistGetters<Wishlist, WishlistItem> = {
  getItems,
  getTotals,
  getItemName,
  getItemImage,
  getItemPrice,
  getItemQty,
  getItemAttributes,
  getShippingPrice,
  getItemSku,
  getTotalItems,
  getFormattedPrice,
  getLink
};
