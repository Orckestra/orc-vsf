import type { InventoryItemAvailability } from '@vue-storefront/orc-vsf-api';
import { UseInventoryGetters } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProductSkusAvailableToSell(items: InventoryItemAvailability[], availableInventoryStatuses: string[]): string[] {
  if (!items) return;
  let result = [];
  items.forEach(item => {
    let status = item.statuses?.[0];
    if (availableInventoryStatuses.includes(status.status)) {
      result.push(item.identifier.sku);
    }
  });
  return result;
}

function getSkuAvailableQuantity(items: InventoryItemAvailability[], sku: string): number {
  if (!items) return;
  const item = items.find(i => i.identifier.sku === sku);
  const status = item?.statuses?.[0];
  return status?.quantity;
}

function getSkuStatus(items: InventoryItemAvailability[], sku: string): string {
  if (!items) return;
  const item = items.find(i => i.identifier.sku === sku);
  const status = item?.statuses?.[0];
  return status?.status;
}


export const inventoryGetters: UseInventoryGetters<InventoryItemAvailability> = {
  getProductSkusAvailableToSell,
  getSkuAvailableQuantity,
  getSkuStatus
};
