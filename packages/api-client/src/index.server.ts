import { apiClientFactory } from '@vue-storefront/core';
import type { Setttings, Endpoints } from './types';
import axios from 'axios';

import getProduct from './api/getProduct';
import getProducts from './api/getProducts';
import getCategory from './api/getCategory';
import getCart from './api/carts/getCart';
import addCartItem from './api/carts/addCartItem';
import removeCartItem from './api/carts/removeCartItem';
import updateCartItem from './api/carts/updateCartItem';
import updateCartShipment from './api/carts/updateCartShipment';
import getFulfillmentLocations from './api/getFulfillmentLocations';
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
import changePassword from './api/membership/changePassword';

import { tokenExtension } from './extensions/auth';

function onCreate(settings) {
  const client = axios.create({
    baseURL: settings.api.url,
    headers: {
      'X-AUTH': settings.api.authToken,
      'Content-Type': 'application/json',
    },
  });

  return {
    config: settings,
    client,
  };
}

const { createApiClient } = apiClientFactory<Setttings, Endpoints>({
  onCreate,
  api: {
    getProduct,
    getProducts,
    getCategory,
    getCart,
    addCartItem,
    removeCartItem,
    updateCartItem,
    getFulfillmentLocations,
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
    changePassword,
  },
  extensions: [tokenExtension],
});

export { createApiClient };
