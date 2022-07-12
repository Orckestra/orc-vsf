import type { Metadata } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { useMetadataFactory } from '../factories/useMetadataFactory';

export const useMetadata = useMetadataFactory<Metadata>({
  load: async (context: Context) => {
    let  lookups = await context.$occ.api.getProductLookups({});
    const definitions = await context.$occ.api.getProductDefinitions({});
    lookups.push(await context.$occ.api.getOrderLookups({}));
    return {
      lookups,
      definitions
    };
  }
});
