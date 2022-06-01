import type { Configuration } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { useConfigurationFactory } from '../factories/useConfigurationFactory';

export const useConfiguration = useConfigurationFactory<Configuration>({
  load: async (context: Context) => {
    const consfiguration = await context.$occ.api.getConfiguration({});
    return {
        membership: consfiguration
    };
  }
});
