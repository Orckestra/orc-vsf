/* istanbul ignore file */
import {
  Context,
  useWishlistFactory,
  UseWishlistFactoryParams
} from '@vue-storefront/core';
import type { Wishlist, WishlistItem, Product } from '@vue-storefront/orc-vsf-api';
import { getVariantId } from '../helpers/productUtils';

const params: UseWishlistFactoryParams<Wishlist, WishlistItem, Product> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const userToken = app.$cookies.get(appKey + '_token');
    const wishlist =  await context.$occ.api.getCartLineItems({cartName: "Wishlist", userToken});
    console.log("wishlist");
    console.log(wishlist);
    return wishlist;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, { currentWishlist, product }) => {
    console.log("addItem");
    console.log(product);
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const userToken = app.$cookies.get(appKey + '_token');
    const variantId = getVariantId(product);
    const createdCartItemResult =  await context.$occ.api.addCartItem({ ...params, userToken, productId: product.productId ?? product.id, variantId, quantity: 1, cartName: "Wishlist" });
    const wishList = createdCartItemResult.shipments.flatMap(item => item.lineItems);
    return wishList;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (context: Context, { currentWishlist, product }) => {
    console.log("removeItem");
    console.log(product);
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const userToken = app.$cookies.get(appKey + '_token');
    const prod = product as Product;
    const wishList = currentWishlist as Product[];
    const prodLineItemId = wishList.find(item => item.sku == prod.sku).id;
    const removedLineItemResult = await context.$occ.api.removeCartItem({ ...params, userToken, id: prodLineItemId, cartName: "Wishlist" });
    console.log(removedLineItemResult);
    return removedLineItemResult.shipments.flatMap(item => item.lineItems);
    
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentWishlist }) => {
    console.log('Mocked: useWishlist.clear');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInWishlist: (context: Context, { currentWishlist, product }) => {
    const wishList = currentWishlist as Product[];
    return wishList?.some(item => item.sku === product.sku);
  }
};

export const useWishlist = useWishlistFactory<Wishlist, WishlistItem, Product>(params);
