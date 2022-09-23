import {
  Context,
  useUserShippingFactory,
  UseUserShippingFactoryParams
} from '@vue-storefront/core';
import type {
  UserAddress as AddressItem
} from 'orc-vsf-api';
import { getUserToken } from '../helpers/generalUtils';

const factoryParams: UseUserShippingFactoryParams<AddressItem[], AddressItem> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addAddress: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.addUserAddress({ userToken, address });
    return factoryParams.load(context, params);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteAddress: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.deleteUserAddress({ userToken, addressId: address.id });
    return factoryParams.load(context, params);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAddress: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.updateUserAddress({ userToken, address, addressId: address.id });
    return factoryParams.load(context, params);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context, params) => {
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    return context.$occ.api.getUserAddresses({ userToken });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDefaultAddress: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.updateUserAddress({ userToken, address: { ...address, isPreferredShipping: true }, addressId: address.id });
    return factoryParams.load(context, params);
  }
};

export const useUserShipping = useUserShippingFactory<AddressItem[], AddressItem>(factoryParams);
