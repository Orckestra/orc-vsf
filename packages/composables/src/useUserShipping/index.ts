import {
  Context,
  useUserShippingFactory,
  UseUserShippingFactoryParams
} from '@vue-storefront/core';
import type {
  UserShippingAddress as Address,
  UserShippingAddressItem as AddressItem
} from '@vue-storefront/orc-vsf-api';

const params: UseUserShippingFactoryParams<Address, AddressItem> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addAddress: async (context: Context, params) => {
    const {shipping, address} = params;
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const userToken = app.$cookies.get(appKey + '_token');
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    if (userToken) {
      const addedAddress = await context.$occ.api.addUserAddress({ userToken, address });
      return [...shipping, addedAddress];
    }
    return [] as Address;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteAddress: async (context: Context, params) => {
    const {shipping, address} = params;
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const userToken = app.$cookies.get(appKey + '_token');
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
    return [] as Address;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAddress: async (context: Context, params) => {
    const {shipping, address} = params;
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const userToken = app.$cookies.get(appKey + '_token');
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    if (userToken) {
      const updatedAddress = await context.$occ.api.updateUserAddress({ userToken, address, addressId: address.id });
      const addresses = [...shipping];
      addresses.splice(shipping.findIndex(a => a.id === updatedAddress.id), 1, updatedAddress);
      return addresses;
    }
    return [] as Address;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context, params) => {
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const userToken = app.$cookies.get(appKey + '_token');
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    if (userToken) {
      const addresses = await context.$occ.api.getUserAddresses({ userToken });
      return addresses;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDefaultAddress: async (context: Context, params) => {
    console.log('Mocked: useUserShipping.setDefaultAddress');
    return [] as Address;
  }
};

export const useUserShipping = useUserShippingFactory<Address, AddressItem>(params);
