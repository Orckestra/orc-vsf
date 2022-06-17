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

    const addedAddress = await context.$occ.api.addUserAddress({ userToken, address });
    if (addedAddress.isPreferredShipping) {
      return [...shipping.map(a => ({ ...a, isPreferredShipping: false })), addedAddress];
    }
    return [...shipping, addedAddress];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteAddress: async (context: Context, params) => {
    const {shipping, address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    const data = await context.$occ.api.deleteUserAddress({ userToken, addressId: address.id });
    const addresses = [...shipping];
    if (data !== null) {
      addresses.splice(shipping.findIndex(a => a.id === address.id), 1);
    }
    return addresses;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAddress: async (context: Context, params) => {
    const {shipping, address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    const updatedAddress = await context.$occ.api.updateUserAddress({ userToken, address, addressId: address.id });
    const addresses = updatedAddress.isPreferredShipping ? shipping.map(a => ({ ...a, isPreferredShipping: false })) : [...shipping];
    addresses.splice(shipping.findIndex(a => a.id === updatedAddress.id), 1, updatedAddress);
    return addresses;
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
    const {shipping, address} = params;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    const updatedAddress = await context.$occ.api.updateUserAddress({ userToken, address: { ...address, isPreferredShipping: true }, addressId: address.id });
    const addresses = shipping.map(a => ({ ...a, isPreferredShipping: false }));
    addresses.splice(shipping.findIndex(a => a.id === updatedAddress.id), 1, updatedAddress);
    return addresses;
  }
};

export const useUserShipping = useUserShippingFactory<AddressItem[], AddressItem>(params);
