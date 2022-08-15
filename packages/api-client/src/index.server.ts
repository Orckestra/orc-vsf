import { apiClientFactory } from '@vue-storefront/core';
import type { Setttings, Endpoints } from './types';
import axios from 'axios';
import NodeCache from 'node-cache';
import getProduct from './api/getProduct';
import getProducts from './api/getProducts';
import getCategory from './api/getCategory';
import getCart from './api/carts/getCart';
import updateCart from './api/carts/updateCart';
import addCartItem from './api/carts/addCartItem';
import removeCartItem from './api/carts/removeCartItem';
import updateCartItem from './api/carts/updateCartItem';
import addCoupon from './api/carts/addCoupon';
import removeCoupon from './api/carts/removeCoupon';
import updateCartShipment from './api/carts/updateCartShipment';
import getFulfillmentLocations from './api/fulfillmentLocations/getFulfillmentLocations';
import getInventoryLocations from './api/fulfillmentLocations/getInventoryLocations';
import getProductLookups from './api/metadata/getProductLookups';
import getProductDefinitions from './api/metadata/getProductDefinitions';
import findInventoryItemStatus from './api/inventoryItems/findInventoryItemStatus';
import getUser from './api/users/getUser';
import initializeGuestToken from './api/users/initializeGuestToken';
import login from './api/membership/login';
import registerUser from './api/membership/registerUser';
import getMembershipConfiguration from './api/membership/getConfiguration';
import resetPassword from './api/membership/resetPassword';
import getByTicket from './api/users/getByTicket';
import updateUser from './api/users/updateUser';
import getCartLineItems from './api/carts/getCartLineItems';
import changePassword from './api/membership/changePassword';
import clearCart from './api/carts/clearCart';
import getPaymentMethods from './api/carts/getPaymentMethods';
import getUserAddresses from './api/users/getUserAddresses';
import getCountries from './api/countries/getCountries';
import updateUserAddress from './api/users/updateUserAddress';
import addUserAddress from './api/users/addUserAddress';
import deleteUserAddress from './api/users/deleteUserAddress';
import completeCheckout from './api/carts/completeCheckout';
import getPaymentProviders from './api/providers/getPaymentProviders';
import addPayment from './api/carts/addPayment';
import removePayment from './api/carts/removePayment';
import initializePayment from './api/carts/initializePayment';
import updatePaymentMethod from './api/carts/updatePaymentMethod';
import getFulfillmentMethods from './api/fulfillmentMethods/getFulfillmentMethods';
import findOrders from './api/orders/findOrders';
import findStores from './api/stores/findStores';
import getOrderByNumber from './api/orders/getOrderByNumber';
import getOrderById from './api/orders/getOrderById';
import getOrderLookups from './api/metadata/getOrderLookups';

import { tokenExtension } from './extensions/auth';

function onCreate(settings) {
  const client = axios.create({
    baseURL: settings.api.url,
    headers: {
      'X-AUTH': settings.api.authToken,
      'Content-Type': 'application/json'
    }
  });

  const cache = new NodeCache({ stdTTL: 300 });

  return {
    config: settings,
    client,
    cache
  };
}

const { createApiClient } = apiClientFactory<Setttings, Endpoints>({
  onCreate,
  api: {
    getProduct,
    getProducts,
    getCategory,
    getCart,
    updateCart,
    addCartItem,
    removeCartItem,
    updateCartItem,
    addCoupon,
    removeCoupon,
    getFulfillmentLocations,
    getInventoryLocations,
    updateCartShipment,
    getProductLookups,
    getProductDefinitions,
    findInventoryItemStatus,
    getUser,
    initializeGuestToken,
    login,
    registerUser,
    getMembershipConfiguration,
    resetPassword,
    getByTicket,
    updateUser,
    getCartLineItems,
    changePassword,
    clearCart,
    getUserAddresses,
    getCountries,
    updateUserAddress,
    addUserAddress,
    deleteUserAddress,
    getPaymentProviders,
    getPaymentMethods,
    addPayment,
    removePayment,
    initializePayment,
    updatePaymentMethod,
    getFulfillmentMethods,
    completeCheckout,
    findOrders,
    getOrderByNumber,
    getOrderById,
    getOrderLookups,
    findStores
  },
  extensions: [tokenExtension]
});

export { createApiClient };
