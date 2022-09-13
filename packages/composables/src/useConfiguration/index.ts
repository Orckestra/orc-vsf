import type { Configuration } from 'orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { useConfigurationFactory } from '../factories/useConfigurationFactory';

export const useConfiguration = useConfigurationFactory<Configuration>({
  load: async (context: Context) => {
    const membership = await context.$occ.api.getMembershipConfiguration();
    return {
      membership
    };
  }
});
