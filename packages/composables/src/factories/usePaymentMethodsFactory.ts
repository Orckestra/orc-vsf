import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, configureFactoryParams, Logger } from '@vue-storefront/core';
import { UsePaymentMethodsFactoryParams, UsePaymentMethods, UsePaymentMethodsErrors } from '../types';

export function usePaymentMethodsFactory <PAYMENTMETHOD>(
  factoryParams: UsePaymentMethodsFactoryParams<PAYMENTMETHOD>
): UsePaymentMethods<PAYMENTMETHOD> {

  return function usePaymentMethods (id: string) {

    /* @private */
    const _factoryParams = configureFactoryParams(factoryParams);

    /* @readonly */
    const methods: Ref<PAYMENTMETHOD[] | null> = sharedRef(null, `usePaymentMethods-methods-${id}`);
    const loading: Ref<boolean> = sharedRef(false, `usePaymentMethods-loading-${id}`);
    const error: Ref<UsePaymentMethodsErrors> = sharedRef({ load: null}, `usePaymentMethods-error-${id}`);

    /* @public */
    async function load ({ providerName }): Promise<void> {
      Logger.debug('usePaymentMethodsFactory.load');

      error.value.load = null;

      try {
        loading.value = true;
        methods.value = await _factoryParams.load({ providerName });
      } catch (err) {
        error.value.load = err;
      } finally {
        loading.value = false;
      }
    }

    /* @interface */
    return {
      load,
      methods: computed(() => methods.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}
