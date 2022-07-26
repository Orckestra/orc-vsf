# `useOrder`

`useOrder` composition API function is responsible for interactions with order. 

## API
```ts
export type UserOrder = {
    cart: Cart,
    created: string,
    createdBy: string,
    customerId: string,
    customerName: string,
    entityVersion: string,
    id: string,
    itemCount: number,
    lastModified: string,
    lastModifiedBy: string,
    orderNumber: string,
    orderStatus: string,
    scopeId: string,
    source: string,
    transactionOrderNumber: number
};
```

### `find`
function required to fetch order by `orderNumber` or `orderId` from a server.

### `response`
Reactive data object containing the response from the backend.

### `loading`
Reactive object containing information about the loading state of search.

### `error`
Reactive object containing the error message, if search failed for any reason.

## orderGetters

````typescript
export interface OrderGetters<UserOrder, OrderItem> {
    getDate: (order: UserOrder) => string;
    getId: (order: UserOrder) => string;
    getNumber: (order: UserOrder) => string;
    getCustomerName: (order: UserOrder) => string;
    getCustomerEmail: (order: UserOrder) => string;
    getStatus: (order: UserOrder) => string;
    getTotal: (order: UserOrder) => number;
    getSubTotal: (order: UserOrder) => number;
    getCart: (order: UserOrder) =>  Cart;
    getItems: (order: UserOrder) => CartItem[];
    getItemSku: (item: CartItem) => string;
    getItemName: (item: CartItem) => string;
    getItemQty: (item: CartItem) => number;
    getItemPrice: (item: CartItem) =>  number;
    getItemPrices: (item: CartItem) =>  AgnosticPrice;
    getItemTotal: (item: CartItem) => number;
    getItemLink: (item: CartItem) => string;
    getItemImage: (item: CartItem) => string
    getFulfillmentMethod: (order: UserOrder) => FulfillmentMethod;
    getPaymentMethod: (order: UserOrder) => PaymentMethod;
    getTaxes: (order: UserOrder) => Tax[];
    getShippingAddress: (order: UserOrder) => UserAddress;
    getShipmentStatus: (order: UserOrder) => string;
    getPaymentAddress: (order: UserOrder) => UserAddress;
}
````

## Examples
```javascript
import { useOrder, orderGetters } from '@vue-storefront/occ';
import { onSSR } from '@vue-storefront/core'

export default {
  setup() {
    const { response: order, find } = useOrder();

    onSSR(async () => {
        const orderNumber = 1111;
        await find({orderNumber});
    })

    return {
      products: computed(() => orderGetters.getItems(order.value))
    }
  }
}
```
