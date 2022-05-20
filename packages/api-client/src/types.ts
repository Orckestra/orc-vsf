export type TODO = unknown;

export type Setttings = TODO;

export type Endpoints = TODO;

export type BillingAddress = TODO;

export type CartItemSummary = {
    propertyBag: any,
    displayName: string,
    unitOfMeasure: string,
    itemFormat: any,
    brand: string,
    productWeightUOM: string,
    productWeight: number,
    primaryParentCategoryId: string,
    isProductWithoutPrice: boolean,
    allowSelectionWithoutScan: boolean
}

export type CartItem = {
    id: string,
    productSummary: CartItemSummary,
    quantity: number,
    listPrice: number,
    currentPrice: number,
    defaultListPrice: number,
    regularPrice: number,
    defaultPrice: number,
    placedPrice: number,
    total: number,
    status: string,
    sku: string,
    kvaValues: any,
    totalWithoutDiscount: number,
    productDefinitionName: string,
    productId: string,
    variantId: string,
    recurringOrderProgramName: string,
    recurringOrderFrequencyName: string,
    coverImage?:string
}

export type Shipment = {
    lineItems: CartItem [],
    fulfillmentLocationId: string
}

export type Cart = {
    messages?: any,
    customerId: any,
    name: string,
    cartType?: string,
    coupons?: string,
    shipments: Shipment[],
    subTotal: number,
    taxTotal: number,
    merchandiseTotal: number,
    total: number,
    scopeId: string,
    status: string,
    lineItemsTotalWithoutDiscount: number,
    lineItemLevelDiscount: number,
    lineItemsTotal: number,
    itemCount: number
};

export type Category = {
    id: string,
    name: string,
    primaryParentCategoryId: string,
    definitionName: string,
    sequenceNumber: number,
    catalogId: string,
    displayName: object,
    includeInSearch: boolean,
    productsCount: number
};

export type Coupon = TODO;

export type FacetValue = {
    minimumValue?: any,
    maximumValue?: any,
    value: string,
    displayName: string,
    count: number
};

export type Facet = {
    facetType: any,
    title: string,
    fieldName: string,
    values: FacetValue[],
    gapSize?: string,
    startValue?: string,
    endValue?: string
};

export type SearchResults = {
    total: any,
    products: any,
    facets: Facet[],
    categories?: Category[],
    categoryCounts?: any
};

export const enum FacetType
{
    SingleSelect = 0,
    MultiSelect = 1,
    Range = 2
}

export type FacetSearchCriteria = TODO;

export type Order = TODO;

export type OrderItem = TODO;

export type PasswordResetResult = TODO;

export type ProductVariant = {
    active?: boolean,
    id: string,
    sku: string,
    propertyBag: any
}

export type Product = {
    id?:string,
    productId?: string,
    name: any,
    description?: any,
    sku: string,
    currentPrice?: any,
    regularPrice?: any,
    propertyBag: any,
    parentCategoryIds: any,
    prices?: any,
    coverImage?: any,
    variants?: ProductVariant[]
};

export const enum ProductsQueryType {
    List = 'LIST',
    Detail = 'DETAIL'
}

export type ProductFilter = TODO;

export type Review = TODO;

export type ReviewItem = TODO;

export type User = TODO;

export type UserBillingAddress = TODO;

export type UserBillingAddressItem = TODO;

export type UserBillingAddressSearchCriteria = TODO;

export type UserShippingAddress = TODO;

export type UserShippingAddressItem = TODO;

export type UserShippingAddressSearchCriteria = TODO;

export type ShippingAddress = TODO;

export type ShippingMethod = TODO;

export type ShippingProvider = TODO;

export type Store = TODO;

export type Wishlist = TODO;

export type WishlistItem = TODO;
