# useSearch

## Features
`useInventory` composable is responsible for fetching a data of product inventory statuses

## API
```typescript

interface UseInventory<InventoryItemAvailability> {
  (): UseInventoryInterface<InventoryItemAvailability>;
}

interface UseInventoryInterface<InventoryItemAvailability> {
  find(params): Promise<void>;
  loading: ComputedProperty<boolean>;
  result: ComputedProperty<InventoryItemAvailability>;
  error: ComputedProperty<UseInventoryErrors>;
}

export type InventoryItemIdentifier = {
    inventoryLocationId: string,
    sku: string
}

export type InventoryItemStatus = {
    quantity: number,
    // InStock, OutOfStock, PreOrder, BackOrder
    status:	string
}

export type InventoryItemAvailability = {
    date: string,
    identifier: InventoryItemIdentifier,
    statuses: InventoryItemStatus[]
}
```

### `find`
Function that returns inventory item availabilities. 

### `result`
Reactive data object containing the response from the backend.

### `loading`
Reactive object containing information about the loading state of find.

### `error`
Reactive object containing the error message, if find failed for any reason.

## Getters
````typescript
export interface UseInventoryGetters<InventoryItemAvailability> {
  getProductSkusAvailableToSell(items: InventoryItemAvailability[], availableInventoryStatuses: string[]): string[];
  getSkuAvailableQuantity(items: InventoryItemAvailability[], sku: string): number;
  getSkuStatus(items: InventoryItemAvailability[], sku: string): string;
}
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useInventory, inventoryGetters } from '@vue-storefront/orc-vsf';

export default {
  setup () {
    const { find, result } = useInventory();
   

    onSSR(async () => {
      await find({skus: ['PRODUCTSKU']});
    });

    return {
      result,
      inventoryGetters
    }
  }
}
```