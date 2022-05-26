import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';
import { UseInventoryFactoryParams, UseInventory, UseInventoryErrors } from '../types';

export function useInventoryFactory <INVENTORYITEM>(
  factoryParams: UseInventoryFactoryParams<INVENTORYITEM>
): UseInventory<INVENTORYITEM> {

  return function UseInventory () {

    /* @private */
    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const result: Ref<INVENTORYITEM | null> = sharedRef(null, 'useInventory-result');
    const loading: Ref<boolean> = sharedRef(false, 'useInventory-loading');
    const error: Ref<UseInventoryErrors> = sharedRef({ load: null}, 'useInventory-error');

    /* @public */
    async function find (params): Promise<void> {
      Logger.debug('useInventoryFactory.find');

      error.value.load = null;

      try {
        loading.value = true;
        result.value = await _factoryParams.find(params);
      } catch (err) {
        error.value.load = err;
      } finally {
        loading.value = false;
      }
    }

    /* @interface */
    return {
      find,
      result: computed(() => result.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}
