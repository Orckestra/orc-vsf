export type TODO = unknown;

export type Setttings = TODO;

export type Endpoints = TODO;

export type BillingAddress = TODO;

export type Cart = TODO;

export type CartItem = TODO;

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

export type SearchResults = {
    total: any,
    products: any,
    facets: Facet[],
    categories?: Category[],
    categoryCounts?: any
};

export type Facet = {
    facetType: any,
    title: string,
    fieldName: string,
    values: FacetValue[]
};

export type FacetValue = {
    minimumValue?: any,
    maximumValue?: any,
    value: string,
    displayName: string,
    count: number
};

export type FacetSearchCriteria = TODO;

export type Order = TODO;

export type OrderItem = TODO;

export type PasswordResetResult = TODO;

export type Product = {
    productId: string,
    name: any,
    description?: any,
    sku: string,
    currentPrice?: any,
    regularPrice?: any,
    propertyBag: any,
    parentCategoryIds: any,
    prices?: any
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
