import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';
import { UseMetadataFactoryParams, UseMetadata, UseMetadataErrors } from '../types';

export function useMetadataFactory <METADATA>(
  factoryParams: UseMetadataFactoryParams<METADATA>
): UseMetadata<METADATA> {

  return function useMetadata () {

    /* @private */
    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const response: Ref<METADATA | null> = sharedRef(null, 'useMetadata-response');
    const loading: Ref<boolean> = sharedRef(false, 'useMetadata-loading');
    const error: Ref<UseMetadataErrors> = sharedRef({ load: null}, 'useMetadata-error');

    /* @public */
    async function load (): Promise<void> {
      Logger.debug('useMetadataFactory.load');

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