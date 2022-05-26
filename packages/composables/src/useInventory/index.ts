import type { InventoryItemAvailability } from '@vue-storefront/orc-vsf-api';
import { Context } from '@vue-storefront/core';
import { useInventoryFactory } from '../factories/useInventoryFactory';

export const useInventory = useInventoryFactory<InventoryItemAvailability>({
  find: async (context: Context, params: any) => {
    const { skus, inventoryLocationId } = params;
    return await context.$occ.api.findInventoryItemStatus({ skus, inventoryLocationId });
  }
});
