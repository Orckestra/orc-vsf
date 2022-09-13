# useStores

## Features
`useStores` composable is responsible for fetching a data of stores

## API
```typescript
export declare type FulfillmentLocation = {
    addresses: any[]
    addressIds: any[]
    displayName: any,
    id: string,
    inventoryLocationId: string,
    inventoryProviderId: string,
    isActive: boolean,
    isInventoryEnabled: boolean,
    isPickUpLocation: boolean,
    name: string,
    number: string,
    schedules: FulfillmentSchedule[],
    supportDelivery: boolean,
    supportPickUp: boolean,
    supportShipping: boolean,
    supportShipToStore: boolean,
    timeZone: string,
    type: string
};

export declare type Store = {
    displayName: any,
    email: string,
    faxExtension: string,
    faxNumber: string,
    fulfillmentLocation: FulfillmentLocation,
    id: string,
    isActive: boolean,
    manager: string,
    name: string,
    number: string,
    phoneExtension: string,
    phoneNumber: string,
    storeType: string,
    deliverySchedule: FulfillmentSchedule,
    pickUpSchedule: FulfillmentSchedule,
    storeSchedule: FulfillmentSchedule,
};

export type ScheduleInterval = {
    beginingTime: string,
    endingTime: string
}

export type DailyScheduleException = {
    id: string,
    name: string,
    isClosed: boolean,
    isRecurren: boolean,
    startDate: string,
    endDate: string,
    openingTime: ScheduleInterval
}
export type DailySchedule = {
    day: string,
    isClosed: boolean,
    isOpenedAllDay: boolean,
    openingTimes: ScheduleInterval[]
}

export type FulfillmentSchedule = {
    fulfillmentLocationId: string,
    openingHourExceptions: DailyScheduleException[],
    openingHours: DailySchedule[],
    propertyBag: any,
    scheduleType: ScheduleType
}

export declare type StoreQueryResult = {
    totalCount: number;
    results: Store[];
};

export declare type UseStoresSearchParams = {
  locale: string,
  page: number,
  itemsPerPage: number,
  sorting: any[]
};

export interface UseStoresErrors {
  search: Error;
}

export interface UseStores<STORES, STORES_SEARCH_PARAMS, API extends PlatformApi = any> extends Composable<API> {
  stores: ComputedProperty<STORES>;
  search(params: STORES_SEARCH_PARAMS): Promise<any>;
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UseStoresErrors>;
}

export interface UseStoresFactoryParams<STORES, STORES_SEARCH_PARAMS> extends FactoryParams {
  search(context: Context, params: STORES_SEARCH_PARAMS): Promise<STORES>;
}
```

### `search`
Function that search the stores data. 

### `stores`
Reactive data object containing the response from the backend.

### `loading`
Reactive object containing information about the loading state of search.

### `error`
Reactive object containing the error message, if search failed for any reason.

## Getters
````typescript
interface UseStoresGetters<STORES> {
  getStores(stores: any): STORES[];
  getStoresForPickUp(stores: any): STORES[];
}
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useStores, storesGetters } from 'orc-vsf';

export default {
  setup () {
    const { stores: storesList, search: loadStoresList } = useStores();
   

    onSSR(async () => {
      await loadStoresList();
    });

    return {
      storesList,
      storesGetters
    }
  }
}
```