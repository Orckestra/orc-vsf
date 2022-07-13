import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';
import { UseOrdersHistoryFactoryParams, UseOrdersHistory, UseOrdersHistoryErrors } from '../types';

export function useOrdersHistoryFactory<ORDERSHISTORY>(
  factoryParams: UseOrdersHistoryFactoryParams<ORDERSHISTORY>
): UseOrdersHistory<ORDERSHISTORY> {

  return function useOrdersHistory(id: string) {

    /* @private */
    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const response: Ref<ORDERSHISTORY | null> = sharedRef(null, `useOrdersHistory-response${id}`);
    const loading: Ref<boolean> = sharedRef(false, 'useOrdersHistory-loading');
    const error: Ref<UseOrdersHistoryErrors> = sharedRef({ load: null }, 'useOrdersHistory-error');

    /* @public */
    async function load(params): Promise<void> {
      Logger.debug('useOrdersHistoryFactory.load');

      error.value.load = null;

      try {
        loading.value = true;
        response.value = await _factoryParams.load(params);
      } catch (err) {
        error.value.load = err;
        console.error(err);
      } finally {
        loading.value = false;
      }
    }

    /* @interface */
    return {
      load,
      response: computed(() => response.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}
