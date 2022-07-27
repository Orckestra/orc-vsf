import {
  Context,
  FactoryParams,
  CustomQuery,
  PlatformApi
} from '@vue-storefront/core';
import { UseStores, UseStoresErrors } from '../types';
import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';

export interface UseStoresFactoryParams<STORES, STORES_SEARCH_PARAMS, API extends PlatformApi = any> extends FactoryParams<API> {
  search: (context: Context, params: STORES_SEARCH_PARAMS & {
    customQuery?: CustomQuery;
  }) => Promise<STORES>;
}
export function useStoresFactory<STORES, STORES_SEARCH_PARAMS, API extends PlatformApi = any>(factoryParams: UseStoresFactoryParams<STORES, STORES_SEARCH_PARAMS, API>): () => UseStores<STORES, STORES_SEARCH_PARAMS, API> {

  return function useStores() {

    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const stores: Ref<STORES | null> = sharedRef(null, 'useStores-stores');
    const loading: Ref<boolean> = sharedRef(false, 'useStores-loading');
    const error: Ref<UseStoresErrors> = sharedRef({ search: null }, 'useStores-error');

    /* @public */
    async function search(params): Promise<void> {
      Logger.debug('useStoresFactory.search');

      error.value.search = null;

      try {
        loading.value = true;
        stores.value = await _factoryParams.search(params);
      } catch (err) {
        error.value.search = err;
      } finally {
        loading.value = false;
      }
    }

    /* @interface */
    return {
      stores: computed(() => stores.value),
      search,
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}

