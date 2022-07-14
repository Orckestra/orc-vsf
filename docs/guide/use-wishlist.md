# `useWishlist`

`useWishlist` composition API function is responsible for interactions with wishlist. 

## API
```ts
export type WishlistItem = {
    productSummary: any;
    placedQuantity: number;
    pricingCalculationSummary: any;
    listPrice: number;
    currentPrice: number;
    defaultListPrice: number;
    regularPrice: number;
    defaultPrice: number;
    shipmentId: string;
    discountAmount: number;
    total: number;
    status: string;
    sku: string;
    totalWithoutDiscount: number;
    rewards: any;
    additionalFees: any;
    additionalFeeAmount: number;
    productDefinitionName: string;
    kvaValues: any;
    isGiftItem: false;
    kvaDisplayValues:any;
    productId: string;
    variantId: string;
    giftWrap: boolean;
    quantity: number;
    id: string;
    propertyBag: any;
    coverImage?: any;
};

export type Wishlist = {
    items: WishlistItem[];
};
```

### `load`
function required to fetch wishlist from a server.

### `addItem`
Adds wishlist item to an current customer.

### `removeItem`
Removes wishlist item from the current customer.

### `clear`
clear wishlist for an current customer.

### `isInWishlist`
Checks if a product is currently in the wishlist. 

### `loading`
Reactive object containing information about loading state of wishlist.

## wishlistGetters

- `getTotals` - Return an object wishlist totals
    - `total` (float) - The value of wishlist total
    - `subtotal` (float) - The value of wishlist sub total.
- `getItemPrice` - Return object of wishlist item price. 
    - `regular` (float) - The value of wishlist item regular price
    - `special` (float) - The value of wishlist item special price.
- `getItems` - Return list of wishlist items.
- `getItemName` - Accept one parameter `WishlistItem` and return the name of wishlist item.
- `getItemImage` - Accept one parameter `WishlistItem` and return the image source URL of wishlist item.
- `getItemQty` - TODO.
- `getItemAttributes` - Accept two parameter, `WishlistItem` and `filters` (Optional). 
- `getItemSku` - Accept one parameter `WishlistItem` and return the sku of wishlist item.
- `getShippingPrice` - TODO.
- `getTotalItems` - To get the total numbers of wishlist items
- `getFormattedPrice` - TODO

## Examples
```javascript
import { useWishlist, wishlistGetters } from '@vue-storefront/occ';
import { onSSR } from '@vue-storefront/core'

export default {
  setup() {
    const { wishlist, removeItem, addItem, load } = useCart();

    onSSR(async () => {
      await load();
    })

    return {
      removeItem,
      addItem,
      wishlist: computed(() => wishlistGetters.getItems(wishlist.value)),
      totals: computed(() => wishlistGetters.getTotals(wishlist.value)),
      totalItems: computed(() => wishlistGetters.getTotalItems(wishlist.value))
    }
  }
}
```
