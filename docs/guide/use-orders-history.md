# `useOrdersHistory`

`useOrdersHistory` composition API function is responsible for interactions with order history. 

## API
```ts
export type OrderItem = {
    billingCurrency: string,
    created: string,
    customerEmail: string,
    customerId: string,
    customerName: string,
    id: string,
    messages: TODO,
    orderNumber: string,
    orderStatus: string,
    postProcessingExecutionResult: string,
    propertyBag: TODO,
    scopeId: string
    shipmentItems: ShipmentItem[],
    source: string,
    total: number
};

export type OrderQueryResult = {
    totalCount: number;
    results: OrderItem[];
};
```

### `load`
function required to fetch order history from a server.

### `response`
Reactive data object containing the response from the backend.

### `loading`
Reactive object containing information about the loading state of search.

### `error`
Reactive object containing the error message, if search failed for any reason.

## ordersHistoryGetters

- `getOrdersHistory` - Return an list of orders history
- `getOrdersTotal` - Return total count of orders from history
- `getDate` - Return order's created date
- `getId`- Return order's Id
- `getStatus`- Return order's Status
- `getPrice`- Return order's Price
- `getNumber`- Return order's Number

## Examples
```javascript
import { useOrdersHistory, ordersHistoryGetters } from '@vue-storefront/occ';
import { onSSR } from '@vue-storefront/core'

export default {
  setup() {
    const { response, load } = useOrdersHistory();

    onSSR(async () => {
      await load();
    })

    return {
      ordersHistory: computed(() => ordersHistoryGetters.getOrdersHistory(response.value))
    }
  }
}
```
