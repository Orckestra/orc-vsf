import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';
import { UseCountriesFactoryParams, UseCountries, UseCountriesErrors } from '../types';

export function useCountriesFactory <COUNTRIES>(
  factoryParams: UseCountriesFactoryParams<COUNTRIES>
): UseCountries<COUNTRIES> {

  return function useCountries () {

    /* @private */
    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const countries: Ref<COUNTRIES | null> = sharedRef(null, 'useCountries-countries');
    const loading: Ref<boolean> = sharedRef(false, 'useCountries-loading');
    const error: Ref<UseCountriesErrors> = sharedRef({ load: null}, 'useCountries-error');

    /* @public */
    async function load (): Promise<void> {
      Logger.debug('useCountriesFactory.load');

      error.value.load = null;

      try {
        loading.value = true;
        countries.value = await _factoryParams.load();
      } catch (err) {
        error.value.load = err;
      } finally {
        loading.value = false;
      }
    }

    /* @interface */
    return {
      load,
      countries: computed(() => countries.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}
