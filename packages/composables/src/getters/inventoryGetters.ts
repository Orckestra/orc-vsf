import type { InventoryItemAvailability } from 'orc-vsf-api';
import { UseInventoryGetters } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProductSkusAvailableToSell(items: InventoryItemAvailability[], availableInventoryStatuses: string[]): string[] {
  if (!items) return;
  const result = [];
  items.forEach(item => {
    const status = item.statuses?.[0];
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
