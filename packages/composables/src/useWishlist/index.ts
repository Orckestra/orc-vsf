/* istanbul ignore file */
import {
  Context,
  useWishlistFactory,
  UseWishlistFactoryParams
} from '@vue-storefront/core';
import { Wishlist, WishlistItem, Product } from 'orc-vsf-api';
import { getVariantId } from '../helpers/productUtils';

const params: UseWishlistFactoryParams<Wishlist, WishlistItem, Product> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {
    const wishlist = await context.$occ.api.getCart({ cartName: 'Wishlist' });
    return { items: wishlist?.items || [] };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, { currentWishlist, product }) => {
    const variantId = getVariantId(product);
    const productId = product.productId ?? product.propertyBag?.ProductId ?? product.id;
    const createdCartItemResult = await context.$occ.api.addCartItem({ ...params, productId: productId, variantId, quantity: 1, cartName: 'Wishlist' });
    const wishListItems = createdCartItemResult.shipments.flatMap(item => item.lineItems);
    return { items: wishListItems };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (context: Context, { currentWishlist, product }) => {
    const prod = product as WishlistItem;
    const sku = prod.sku ?? prod.propertyBag?.Sku;
    const prodLineItemId = currentWishlist.items.find(item => item.sku === sku).id;
    const removedLineItemResult = await context.$occ.api.removeCartItem({ ...params, id: prodLineItemId, cartName: 'Wishlist' });
    const wishListItems = removedLineItemResult.shipments.flatMap(item => item.lineItems);
    return { items: wishListItems };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentWishlist }) => {
    await context.$occ.api.clearCart({ cartName: 'Wishlist' });
    return { items: null };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInWishlist: (context: Context, { currentWishlist, product }) => {
    const sku = product.sku ?? product.propertyBag?.Sku;
    return currentWishlist && currentWishlist.items?.some(item => item.sku === sku);
  }
};

export const useWishlist = useWishlistFactory<Wishlist, WishlistItem, Product>(params);
