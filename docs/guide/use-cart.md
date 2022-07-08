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
export declare type CustomerSummary = {
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    phone: string;
    type: CustomerType;
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
export declare type Tax = {
    code: string;
    displayName: any;
    id: string;
    isShippingFeeTax: boolean;
    isShippingTax: boolean;
    lineItemIds: any;
    percentage: number;
    taxAmount: number;
    taxCategoryId: string;
    taxForShipmentId: string;
    taxTotal: number;
};
export declare type FulfillmentMethod = {
    id: string;
    propertyBag: any;
    carrierName: string;
    carrierOptionDisplayName: any;
    carrierServiceLevel: string;
    cost: number;
    displayName: any;
    expectedDeliveryDate: string;
    fulfillmentMethodType: string;
    shipmentId: string;
    shippingProviderId: string;
    taxCategory: string;
};
export declare type ShipmentAdditionalFee = {
    id: string;
    amount: number;
    description: string;
    displayName: any;
    name: string;
    taxable: boolean;
    taxCategory: string;
};
export declare const enum RewardLevel {
    LineItem = 0,
    Shipment = 1,
    FulfillmentMethod = 2,
    None = 3
}
export declare const enum RewardType {
    Discount = 0,
    External = 1,
    Gift = 2
}
export declare type Reward = {
    id: string;
    amount: number;
    propertyBag: any;
    campaignId: string;
    campaignName: string;
    description: string;
    level: RewardLevel;
    promotionId: string;
    promotionName: string;
    promotionVersion: number;
    relatedObjectId: string;
    rewardType: RewardType;
};
export declare type Shipment = {
    id: string;
    additionalFeeAmount?: number;
    additionalFees?: ShipmentAdditionalFee[];
    address?: UserAddress;
    lineItems: CartItem[];
    fulfillmentLocationId: string;
    fulfillmentMethod: FulfillmentMethod;
    status: string;
    taxes?: Tax[];
    taxProviderId?: string;
    taxTotal?: number;
    total: number;
    trackingNumber?: string;
    propertyBag?: any;
    rewards?: Reward[];
};
export declare const enum CouponState {
    Unspecified,
    Ok,
    NotYetActive,
    Expired,
    GlobalMaximumUsed,
    CustomerMaximumUsed,
    CampaignNotFound,
    CampaignNotLive,
    InvalidCoupon,
    ValidCouponCannotApply
}
export declare type Coupon = {
    id: string;
    couponCode: string;
    couponState: CouponState;
    hasBeenConsumed: boolean;
    isActive: boolean;
    isDeleted: boolean;
    mode: CouponMode;
    promotionId: string;
    usedCount: number;
};
export declare type Cart = {
    messages?: any;
    customerId: any;
    customer: CustomerSummary;
    coupons?: Coupon[];
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

### `update`
Update cart with new values. It used for update cart customer details, shipping, billing informations.

### `updateItemQty`
Updates cart item quantity in an current cart 

### `isInCart`
Checks if a product is currently in the cart. 

### `loading`
Reactive object containing information about loading state of the cart.

## cartGetters
````typescript
export interface CartGetters<Cart, CartItem> {
    getItems: (cart: Cart) => CartItem[];
    getItemName: (cartItem: CartItem) => string;
    getItemImage: (cartItem: CartItem) => string;
    getItemPrice: (cartItem: CartItem) => AgnosticPrice;
    getItemQty: (cartItem: CartItem) => number;
    getItemAttributes: (cartItem: CartItem, filters?: Array<string>) => Record<string, AgnosticAttribute | string>;
    getItemSku: (cartItem: CartItem) => string;
    getTotals: (cart: Cart) => AgnosticTotals;
    getShippingPrice: (cart: Cart) => number;
    getTotalItems: (cart: CACartRT) => number;
    getFormattedPrice: (price: number) => string;
    getCoupons: (cart: Cart) => AgnosticCoupon[];
    getInvalidCoupons(cart: Cart) => Coupon[];
    getCouponStateMessages(cart: Cart): string[];
    getDiscounts: (cart: Cart) => AgnosticDiscount[]; // TODO or use getRewards
    getItemsDiscountsAmount(cart: Cart) => number;
    getRewards(cart: Cart, levels?: RewardLevel[]) =>  Reward[];
    getTaxes(cart: Cart) => Tax[];
    getActiveShipment(cart: Cart) =>  Shipment;
    getActiveShipments(cart: Cart) =>  Shipment[];
    isShippingTaxable(shipment: Shipment) => boolean;
    isShippingEstimated(shipment: Shipment) => boolean;
    isActiveShippingEstimated(cart: Cart) => boolean;
    getTaxableAdditionalFees(cart: Cart) => ShipmentAdditionalFee[];
    getNotTaxableAdditionalFees(cart: Cart) => ShipmentAdditionalFee[];
    getActivePayment(cart: Cart) =>  Payment;
    isReadyForOrder(cart: Cart) => boolean;
}
````

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
