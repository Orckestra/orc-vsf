/* istanbul ignore file */
import {
  Context,
  useWishlistFactory,
  UseWishlistFactoryParams
} from '@vue-storefront/core';
import { Wishlist, WishlistItem, Product } from '@vue-storefront/orc-vsf-api';
import { getUserToken } from '../helpers/generalUtils';
import { getVariantId } from '../helpers/productUtils';

const params: UseWishlistFactoryParams<Wishlist, WishlistItem, Product> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {
    const userToken = getUserToken(context);
    return { items: await context.$occ.api.getCartLineItems({cartName: 'Wishlist', userToken}) };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, { currentWishlist, product }) => {
    const userToken = getUserToken(context);
    const variantId = getVariantId(product);
    const createdCartItemResult = await context.$occ.api.addCartItem({ ...params, userToken, productId: product.productId ?? product.id, variantId, quantity: 1, cartName: 'Wishlist' });
    const wishListItems = createdCartItemResult.shipments.flatMap(item => item.lineItems);
    return { items: wishListItems };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (context: Context, { currentWishlist, product }) => {
    const userToken = getUserToken(context);
    const prod = product as WishlistItem;
    const prodLineItemId = currentWishlist.items.find(item => item.sku === prod.sku).id;
    const removedLineItemResult = await context.$occ.api.removeCartItem({ ...params, userToken, id: prodLineItemId, cartName: 'Wishlist' });
    const wishListItems = removedLineItemResult.shipments.flatMap(item => item.lineItems);
    return { items: wishListItems };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentWishlist }) => {
    const userToken = getUserToken(context);
    await context.$occ.api.clearCart({ userToken, cartName: 'Wishlist' });
    return { items: null };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInWishlist: (context: Context, { currentWishlist, product }) => {
    const wishListItems = currentWishlist?.items;
    return wishListItems?.some(item => item.sku === product.sku);
  }
};

export const useWishlist = useWishlistFactory<Wishlist, WishlistItem, Product>(params);
