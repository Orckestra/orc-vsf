import { Context } from '@vue-storefront/core';
import { useFulfillmentMethodsFactory } from '../factories/useFulfillmentMethodsFactory';
import type { FulfillmentMethodInfo } from '@vue-storefront/orc-vsf-api';

export const useFulfillmentMethods = useFulfillmentMethodsFactory<FulfillmentMethodInfo>({
  load: (context: Context) => {
    const app: any = context.$occ.config.app;
    const locale: any = app.i18n.locale;
    return context.$occ.api.getFulfillmentMethods({ locale });
  }
});
