import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';
import { UseFulfillmentMethodsFactoryParams, UseFulfillmentMethods, UseFulfillmentMethodsErrors } from '../types';

export function useFulfillmentMethodsFactory <METHOD>(
  factoryParams: UseFulfillmentMethodsFactoryParams<METHOD>
): UseFulfillmentMethods<METHOD> {

  return function useFulfillmentMethods () {

    /* @private */
    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const fulfillmentMethods: Ref<METHOD[] | null> = sharedRef(null, 'useFulfillmentMethods-fulfillmentMethods');
    const loading: Ref<boolean> = sharedRef(false, 'useFulfillmentMethods-loading');
    const error: Ref<UseFulfillmentMethodsErrors> = sharedRef({ load: null }, 'useFulfillmentMethods-error');

    /* @public */
    async function load (): Promise<void> {
      Logger.debug('useFulfillmentMethodsFactory.load');

      error.value.load = null;

      try {
        loading.value = true;
        fulfillmentMethods.value = await _factoryParams.load();
      } catch (err) {
        error.value.load = err;
      } finally {
        loading.value = false;
      }
    }

    /* @interface */
    return {
      load,
      fulfillmentMethods: computed(() => fulfillmentMethods.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}
