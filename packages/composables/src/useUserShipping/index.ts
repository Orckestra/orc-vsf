import {
  Context,
  useUserShippingFactory,
  UseUserShippingFactoryParams
} from '@vue-storefront/core';
import type {
  UserAddress as AddressItem
} from '@vue-storefront/orc-vsf-api';
import { getUserToken } from '../helpers/generalUtils';

const params: UseUserShippingFactoryParams<AddressItem[], AddressItem> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addAddress: async (context: Context, params) => {
    const {shipping, address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    if (userToken) {
      const addedAddress = await context.$occ.api.addUserAddress({ userToken, address });
      return [...shipping, addedAddress];
    }
    return [];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteAddress: async (context: Context, params) => {
    const {shipping, address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    if (userToken) {
      const data = await context.$occ.api.deleteUserAddress({ userToken, addressId: address.id });
      const addresses = [...shipping];
      if (data !== null) {
        addresses.splice(shipping.findIndex(a => a.id === address.id), 1);
      }
      return addresses;
    }
    return [];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAddress: async (context: Context, params) => {
    const {shipping, address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    if (userToken) {
      const updatedAddress = await context.$occ.api.updateUserAddress({ userToken, address, addressId: address.id });
      const addresses = [...shipping];
      addresses.splice(shipping.findIndex(a => a.id === updatedAddress.id), 1, updatedAddress);
      return addresses;
    }
    return [];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context, params) => {
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    if (userToken) {
      return context.$occ.api.getUserAddresses({ userToken });
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDefaultAddress: async (context: Context, params) => {
    console.log('Mocked: useUserShipping.setDefaultAddress');
    return [];
  }
};

export const useUserShipping = useUserShippingFactory<AddressItem[], AddressItem>(params);
