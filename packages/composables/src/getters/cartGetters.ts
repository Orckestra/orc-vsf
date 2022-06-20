import {
  CartGetters,
  AgnosticPrice,
  AgnosticTotals,
  AgnosticCoupon,
  AgnosticDiscount,
  AgnosticAttribute
} from '@vue-storefront/core';
import type { Cart, CartItem } from '@vue-storefront/orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItems(cart: Cart): CartItem[] {
  const shipment = cart?.shipments[0];
  return shipment?.lineItems;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemName(item: CartItem): string {
  return item?.productSummary.displayName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemImage(item: CartItem): string {
  return item?.coverImage;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemPrice(item: CartItem): AgnosticPrice {
  return {
    regular: item?.regularPrice,
    special: item?.currentPrice < item?.regularPrice ? item?.currentPrice : null
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemQty(item: CartItem): number {
  return item?.quantity;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemAttributes(item: CartItem, filterByAttributeName?: Array<string>): Record<string, AgnosticAttribute | string> {
  const result = {
    ...item?.kvaValues
  };

  if (filterByAttributeName) {
    Object.keys(result).forEach(key => {
      if (!filterByAttributeName.includes(key)) {
        delete result[key];
      }
    });
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemSku(item: CartItem): string {
  return item?.sku;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemStatus(item: CartItem): string {
  return item?.status;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotals(cart: Cart): AgnosticTotals {
  return {
    total: cart?.total,
    subtotal: cart?.subTotal,
    special: cart?.subTotal
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShippingPrice(cart: Cart): number {
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotalItems(cart: Cart): number {
  return cart?.itemCount;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFormattedPrice(price: number): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCoupons(cart: Cart): AgnosticCoupon[] {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDiscounts(cart: Cart): AgnosticDiscount[] {
  return [];
}

function getLink(item: CartItem): string {
  if (!item) return;
  const variantId = item.variantId;
  const productId = item.productId;

  return `/p/${productId}/${item.productSummary.displayName}${variantId ? `?variant=${variantId}` : ''}`;
}

export const cartGetters: CartGetters<Cart, CartItem> = {
  getTotals,
  getShippingPrice,
  getItems,
  getItemName,
  getItemImage,
  getItemPrice,
  getItemQty,
  getItemAttributes,
  getItemSku,
  getItemStatus,
  getFormattedPrice,
  getTotalItems,
  getCoupons,
  getDiscounts,
  getLink
};
