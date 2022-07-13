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
function required to fetch order by orderNumber from a server.

### `response`
Reactive data object containing the response from the backend.

### `loading`
Reactive object containing information about the loading state of search.

### `error`
Reactive object containing the error message, if search failed for any reason.

## orderGetters

- `getDate` - Return an order's created date
- `getId` - Return an order's Id
- `getStatus` - Return an order's Status
- `getPrice` - Return an order cart total
- `getItems` - TODO
- `getItemSku` - TODO
- `getItemName` - TODO
- `getItemQty` - TODO
- `getItemPrice` - TODO
- `getFormattedPrice` - TODO
- `getOrdersTotal` - TODO
- `getProducts` -  Return an order's products
- `getProductQty` -  Return an order's products count
- `getProductQty` -  Return an order product's price
- `getProductSku` -  Return an order product's sku
- `getProductName` -  Return an order product's name
- `getProductTotal` -  Return an order product's total
- `getFulfillmentMethodName` -  Return an shipment fulfillment method name
- `getPaymentMethod` -  Return an payment method
- `getSubTotal` -  Return an cart subtotal
- `getTaxes` -  Return an cart taxes
- `getTaxTotal` -  Return an tax total
- `getTaxName` -  Return an tax name
- `getTotal` -  Return an cart total
- `getSaving` -  Return an cart saving
- `getShippingAddress` -  Return an shipping address
- `getPaymentAddress` -  Return an payment address
- `getProductLink` -  Return an product link
- `getNumber` -  Return an order's number
- `getProductImage` -  Return an product's image
- `getShipmentStatus` -  Return an shipment's status

## Examples
```javascript
import { useOrder, orderGetters } from '@vue-storefront/occ';
import { onSSR } from '@vue-storefront/core'

export default {
  setup() {
    const { response, find } = useOrder();

    onSSR(async () => {
        const orderNumber = 1111;
        await find({orderNumber});
    })

    return {
      products: computed(() => orderGetters.getProducts(response.value))
    }
  }
}
```
