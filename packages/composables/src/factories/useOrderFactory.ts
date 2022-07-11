import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';
import { useOrder, UseOrderFactoryParams, UseOrderErrors } from '../types';

export function useOrderFactory<USERORDER>(factoryParams: UseOrderFactoryParams<USERORDER>): useOrder<USERORDER> {

  return function useOrder () {

    /* @private */
    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const response: Ref<USERORDER | null> = sharedRef(null, 'useOrder-response');
    const loading: Ref<boolean> = sharedRef(false, 'useOrder-loading');
    const error: Ref<UseOrderErrors> = sharedRef({ load: null}, 'useOrder-error');


    /* @public */
    async function find(params): Promise<void> {
      Logger.debug('useOrderFactory.find');

      error.value.load = null;

      try {
        loading.value = true;
        response.value = await _factoryParams.find(params);
      } catch (err) {
        error.value.load = err;
      } finally {
        loading.value = false;
      }
    }

    /* @interface */
    return {
      find,
      response: computed(() => response.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}