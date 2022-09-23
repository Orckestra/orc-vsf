import type { WishlistItem } from 'orc-vsf-api';
import { AgnosticTotals } from '@vue-storefront/core';
export const getTotalPrices = (wishlistItems: WishlistItem[]): AgnosticTotals => {
  if (!wishlistItems) return;

  const totalPrices = {
    total: 0,
    subtotal: 0
  };

  wishlistItems.forEach(item => {
    totalPrices.total += item.regularPrice;
    totalPrices.subtotal += item.currentPrice < item.regularPrice ? item.currentPrice : item.regularPrice;
  });
  return totalPrices;
};
