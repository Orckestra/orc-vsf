# `useCart`

`useCart` composition API function is responsible for interactions with cart. 

## API
```ts
export declare type CartItemSummary = {
    propertyBag: any;
    displayName: string;
    unitOfMeasure: string;
    itemFormat: any;
    brand: string;
    productWeightUOM: string;
    productWeight: number;
    primaryParentCategoryId: string;
    isProductWithoutPrice: boolean;
    allowSelectionWithoutScan: boolean;
};
export declare type CartItem = {
    id: string;
    productSummary: CartItemSummary;
    quantity: number;
    listPrice: number;
    currentPrice: number;
    defaultListPrice: number;
    regularPrice: number;
    defaultPrice: number;
    placedPrice: number;
    total: number;
    status: string;
    sku: string;
    kvaValues: any;
    totalWithoutDiscount: number;
    productDefinitionName: string;
    productId: string;
    variantId: string;
    recurringOrderProgramName: string;
    recurringOrderFrequencyName: string;
    coverImage?: string;
};
export declare type Shipment = {
    lineItems: CartItem[];
};
export declare type Cart = {
    messages?: any;
    customerId: any;
    name: string;
    cartType?: string;
    coupons?: string;
    shipments: Shipment[];
    subTotal: number;
    taxTotal: number;
    merchandiseTotal: number;
    total: number;
    scopeId: string;
    status: string;
    lineItemsTotalWithoutDiscount: number;
    lineItemLevelDiscount: number;
    lineItemsTotal: number;
    itemCount: number;
};
```

### `load`
function required to fetch cart from a server or create new if it doesn't exist.

### `addItem`
Adds cart items to an current cart

### `removeItem`
Removes cart item from the current cart

### `updateItemQty`
Updates cart item quantity in an current cart 

### `isInCart`
Checks if a product is currently in the cart. 

### `loading`
Reactive object containing information about loading state of the cart.

## cartGetters

- `getTotals` - Return an object cart totals
    - `total` (float) - The value of cart total
    - `subtotal` (float) - The value of cart sub total.
- `getShippingPrice` - To retrieve shipping price. 
- `getItems` - Return list of cart items.
- `getItemName` - Accept one parameter `CartItem` and return the name of product.
- `getItemImage` - Accept one parameter `CartItem` and return the image source URL of product.
- `getItemPrice` - Accept one parameter `CartItem` and return the price of product.
- `getItemQty` - Accept one parameter `CartItem` and return the quantity of product.
- `getItemAttributes` - Accept two parameter, `CartItem` and `filterByAttributeName` (Optional). 
- `getItemSku` - Accept one parameter `CartItem` and return the sku of product.
- `getItemStatus` - Accept one parameter `CartItem` and return the status of product, like InStock, OutOfStock.
- `getTotalItems` - To get the total numbers of cart items
- `getCoupons` - TODO
- `getDiscounts` - TODO

## Examples
Cart composable is designed for supporting a single cart and access it everywhere with ease.

Initialization of a cart requires using `load()` when calling `useCart()` for the first time. 

Keep in mind that upon execution of `load`, the cart will get loaded only once. Note that all the composables uses same load method, so you need to use it using alias. load: loadCart.

```javascript
import { useCart, cartGetters } from '@vue-storefront/occ';
import { onSSR } from '@vue-storefront/core'

export default {
  setup() {
    const { cart, removeItem, updateItemQty, load } = useCart();

    onSSR(async () => {
      await load();
    })

    return {
      removeItem,
      updateItemQty,
      products: computed(() => cartGetters.getItems(cart.value)),
      totals: computed(() => cartGetters.getTotals(cart.value)),
      totalItems: computed(() => cartGetters.getTotalItems(cart.value))
    }
  }
}
```
