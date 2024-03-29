import {
  Context
} from '@vue-storefront/core';
import type {
  UserAddress as AddressItem
} from 'orc-vsf-api';
import { getUserToken } from '../helpers/generalUtils';
import { useUserAddressesFactory, UseUserAddressesFactoryParams } from '../factories/useUserAddressesFactory';

const factoryParams: UseUserAddressesFactoryParams<AddressItem> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addAddress: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.addUserAddress({ userToken, address });
    return factoryParams.load(context);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteAddress: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.deleteUserAddress({ userToken, addressId: address.id });
    return factoryParams.load(context);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAddress: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.updateUserAddress({ userToken, address, addressId: address.id });
    return factoryParams.load(context);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return [];
    }

    return (await context.$occ.api.getUserAddresses({ userToken })) || [];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDefaultAddress: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.updateUserAddress({ userToken, address: { ...address, isPreferredShipping: true, isPreferredBilling: true }, addressId: address.id });
    return factoryParams.load(context);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDefaultShipping: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.updateUserAddress({ userToken, address: { ...address, isPreferredShipping: true }, addressId: address.id });
    return factoryParams.load(context);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDefaultBilling: async (context: Context, params) => {
    const {address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    await context.$occ.api.updateUserAddress({ userToken, address: { ...address, isPreferredBilling: true }, addressId: address.id });
    return factoryParams.load(context);
  }
};

export const useUserAddresses = useUserAddressesFactory<AddressItem>(factoryParams);
