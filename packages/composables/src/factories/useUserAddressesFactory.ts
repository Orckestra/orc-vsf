import { Ref, computed } from '@nuxtjs/composition-api';
import {
  Context,
  FactoryParams,
  CustomQuery,
  PlatformApi,
  sharedRef, Logger, mask, configureFactoryParams
} from '@vue-storefront/core';
import { UseUserAddresses, UseUserAddressesErrors } from '../types';

export interface UseUserAddressesFactoryParams<
  USER_ADDRESS_ITEM,
  API extends PlatformApi = any
  > extends FactoryParams<API> {
  addAddress: (
    context: Context,
    params: {
      address: Readonly<USER_ADDRESS_ITEM>;
      customQuery?: CustomQuery;
    }) => Promise<USER_ADDRESS_ITEM[]>;
  deleteAddress: (
    context: Context,
    params: {
      address: Readonly<USER_ADDRESS_ITEM>;
      customQuery?: CustomQuery;
    }) => Promise<USER_ADDRESS_ITEM[]>;
  updateAddress: (
    context: Context,
    params: {
      address: Readonly<USER_ADDRESS_ITEM>;
      customQuery?: CustomQuery;
    }) => Promise<USER_ADDRESS_ITEM[]>;
  load: (context: Context) => Promise<USER_ADDRESS_ITEM[]>;
  setDefaultAddress: (
    context: Context,
    params: {
      address: Readonly<USER_ADDRESS_ITEM>;
      customQuery?: CustomQuery;
    }) => Promise<USER_ADDRESS_ITEM[]>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUserAddressesFactory = <USER_ADDRESS_ITEM, API extends PlatformApi = any>(
  factoryParams: UseUserAddressesFactoryParams<USER_ADDRESS_ITEM, API>
) => {

  const useUserAddresses = (): UseUserAddresses<USER_ADDRESS_ITEM, API> => {
    const loading: Ref<boolean> = sharedRef(false, 'useUserAddresses-loading');
    const addresses: Ref<USER_ADDRESS_ITEM[]> = sharedRef({}, 'useUserAddresses-addresses');
    const error: Ref<UseUserAddressesErrors> = sharedRef({
      addAddress: null,
      deleteAddress: null,
      updateAddress: null,
      load: null,
      setDefaultAddress: null
    }, 'useUserAddresses-error');

    const _factoryParams = configureFactoryParams(
      factoryParams,
      { mainRef: addresses, alias: 'currentShipping', loading, error }
    );

    const addAddress = async ({ address, customQuery }) => {
      Logger.debug('useUserAddresses.addAddress', mask(address));

      try {
        loading.value = true;
        addresses.value = await _factoryParams.addAddress({
          address,
          customQuery
        });
        error.value.addAddress = null;
      } catch (err) {
        error.value.addAddress = err;
        Logger.error('useUserAddresses/addAddress', err);
      } finally {
        loading.value = false;
      }
    };

    const deleteAddress = async ({ address, customQuery }) => {
      Logger.debug('useUserAddresses.deleteAddress', address);

      try {
        loading.value = true;
        addresses.value = await _factoryParams.deleteAddress({
          address,
          customQuery
        });
        error.value.deleteAddress = null;
      } catch (err) {
        error.value.deleteAddress = err;
        Logger.error('useUserAddresses/deleteAddress', err);
      } finally {
        loading.value = false;
      }
    };

    const updateAddress = async ({ address, customQuery }) => {
      Logger.debug('useUserAddresses.updateAddress', address);

      try {
        loading.value = true;
        addresses.value = await _factoryParams.updateAddress({
          address,
          customQuery
        });
        error.value.updateAddress = null;
      } catch (err) {
        error.value.updateAddress = err;
        Logger.error('useUserAddresses/updateAddress', err);
      } finally {
        loading.value = false;
      }
    };

    const load = async () => {
      Logger.debug('useUserAddresses.load');

      try {
        loading.value = true;
        addresses.value = await _factoryParams.load();
        error.value.load = null;
      } catch (err) {
        error.value.load = err;
        Logger.error('useUserAddresses/load', err);
      } finally {
        loading.value = false;
      }
    };

    const setDefaultAddress = async ({ address, customQuery }) => {
      Logger.debug('useUserAddresses.setDefaultAddress', address);

      try {
        loading.value = true;
        addresses.value = await _factoryParams.setDefaultAddress({
          address,
          customQuery
        });
        error.value.setDefaultAddress = null;
      } catch (err) {
        error.value.setDefaultAddress = err;
        Logger.error('useUserAddresses/setDefaultAddress', err);
      } finally {
        loading.value = false;
      }
    };

    return {
      api: _factoryParams.api,
      addresses: computed(() => addresses.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value),
      addAddress,
      deleteAddress,
      updateAddress,
      load,
      setDefaultAddress
    };
  };

  return useUserAddresses;
};
