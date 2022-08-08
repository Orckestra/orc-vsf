import { Store } from '@vue-storefront/orc-vsf-api';
import { Context, useStoreFactory } from '@vue-storefront/core';

export const useStore = useStoreFactory<Store>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load(context: Context, params) {
    console.log('Mocked: useStore.load');

    return Promise.resolve(null);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  change(context: Context, params) {
    console.log('Mocked: useStore.change');

    return Promise.resolve(null);
  }
});
