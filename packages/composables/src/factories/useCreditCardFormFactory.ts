import { Context, FactoryParams, PlatformApi } from '@vue-storefront/core/lib/src/types';
import { Ref, computed } from '@nuxtjs/composition-api';
import { sharedRef, Logger, configureFactoryParams } from '@vue-storefront/core';
import { UseCreditCardForm, UseCreditCardFormErrors } from '../types';

export interface UseCreditCardFormParams<CUSTOMFORMCONTROLLER, API extends PlatformApi = any> extends FactoryParams<API> {
  init: (context: Context, params: {
    currentController?: CUSTOMFORMCONTROLLER; updateControllerCallback: any;
  }) => Promise<void>;
  createTokenData: (context: Context, params: { currentController, cardholderName }) => Promise<any>;
}

export const useCreditCardFormFactory = <CUSTOMFORMCONTROLLER, API extends PlatformApi = any>(
  factoryParams: UseCreditCardFormParams<API>
) => {
  return function useCreditCardForm (): UseCreditCardForm<CUSTOMFORMCONTROLLER, API> {
    const customController: Ref<CUSTOMFORMCONTROLLER> = sharedRef({}, 'useCreditCardForm-controller');
    const loading: Ref<boolean> = sharedRef(false, 'useCreditCardForm-loading');
    const initialized: Ref<boolean> = sharedRef(false, 'useCreditCardForm-initialized');
    const cardholderName: Ref<string> = sharedRef(null, 'useCreditCardForm-cardholderName');
    const tokenData: Ref<any> = sharedRef(false, 'useCreditCardForm-tokendata');
    const error: Ref<UseCreditCardFormErrors> = sharedRef({
      init: null
    }, 'useCreditCardForm-error');

    const _factoryParams = configureFactoryParams(
      factoryParams,
      { mainRef: customController, alias: 'creditCardFormController', loading, error }
    );

    const setCustomController = (controller: CUSTOMFORMCONTROLLER) => {
      customController.value = controller;
      Logger.debug('useCreditCardFormFactory.setController', controller);
    };
    const updateControllerCallback = (key: string, value: any) => {
      const valueToUpdate = {};
      valueToUpdate[key] = value;

      customController.value = {
        ...customController.value,
        ...valueToUpdate
      };
    };

    const updateCardholderName = (name: string) => {
      cardholderName.value = name;
    };

    const init = async () => {
      Logger.debug('useCreditCardForm.init');

      if (!customController.value) {
        return;
      }

      try {
        loading.value = true;
        await _factoryParams.init({ currentController: customController.value, updateControllerCallback });
        error.value.init = null;
        initialized.value = true;
      } catch (err) {
        error.value.init = err;
        initialized.value = false;
        Logger.error('useCreditCardForm/init', err);
      } finally {
        loading.value = false;
      }
    };

    const createTokenData = async () => {
      Logger.debug('useCreditCardForm.createToken');
      const result = await _factoryParams.createTokenData({ currentController: customController.value, cardholderName: cardholderName.value });
      tokenData.value = result;
      return result;
    };

    return {
      api: _factoryParams.api,
      customController: computed(() => customController.value),
      setCustomController,
      tokenData,
      updateCardholderName,
      cardholderName: computed(() => cardholderName.value),
      init,
      initialized: computed(() => initialized.value),
      createTokenData,
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
};
