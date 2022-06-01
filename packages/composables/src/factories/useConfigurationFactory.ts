import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';
import { useConfiguration, UseConfigurationFactoryParams, UseConfigurationErrors } from '../types';

export function useConfigurationFactory <CONFIGURATION>(factoryParams: UseConfigurationFactoryParams<CONFIGURATION>): useConfiguration<CONFIGURATION> {

  return function useConfiguration () {

    /* @private */
    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const response: Ref<CONFIGURATION | null> = sharedRef(null, 'useConfiguration-response');
    const loading: Ref<boolean> = sharedRef(false, 'useConfiguration-loading');
    const error: Ref<UseConfigurationErrors> = sharedRef({ load: null}, 'useConfiguration-error');

    /* @public */
    async function load (): Promise<void> {
      Logger.debug('useConfigurationFactory.load');

      error.value.load = null;

      try {
        loading.value = true;
        response.value = await _factoryParams.load();
      } catch (err) {
        error.value.load = err;
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
