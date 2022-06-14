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
    console.log('Mocked: useUserShipping.addAddress');
    return [] as Address;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteAddress: async (context: Context, params) => {
    console.log('Mocked: useUserShipping.deleteAddress');
    return [] as Address;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAddress: async (context: Context, params) => {
    console.log('Mocked: useUserShipping.updateAddress');
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
