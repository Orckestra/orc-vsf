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
    facetCounts?: any
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
    displayName: any
    propertyBag: any
}

export type KeyVariantAttributeItemValue = {
    title: string,
    value: string,
    selected: boolean,
    disabled: boolean,
    relatedVariantIds?: any
}

export type KeyVariantAttributeItem = {
    values: KeyVariantAttributeItemValue[],
    title: string,
    propertyName?: string,
    propertyDataType?: string
}

export type ResizedMediaLink = {
    // the Url of the media.
    url: string,
    // the name of the size of the media. Examples could be: "S", "M", "L", etc.
    size: string,
    propertyBag?: any,
}

export type ProductMedia = {
    id: string,
    url: string,
    propertyBag?: any,
    mediaType: string,
    position?: number,
    tag?: string,
    title?: string,
    isCover: boolean,
    description?: any,
    isInherited?: boolean,
    isRemoved?: boolean,
    resizedInstances?: ResizedMediaLink[]
}

export type VariantMediaSet = {
    attributesToMatch: any,
    media?: ProductMedia[]
}

export type ProductPriceEntry = {

    /* Indicates whether the price is inherited from parent scope. */
    isInherited: boolean
    price: number,
    priceListCategory: string,

    /* the unique identifier of the PriceList associated to the Product */
    priceListId: string
    priceListType: string,
    sequenceNumber: number
    startDate: any,
    endDate: any,
}

export type VariantPrice = {
    variantId?: string,
    defaultPrice?: number,
    inheritedFromProduct?: boolean,
    pricing?: ProductPriceEntry,
    regularPricing?: ProductPriceEntry
}

export type ProductPrice = {
    productId?: string,
    defaultPrice?: number,
    pricing?: ProductPriceEntry,
    regularPricing?: ProductPriceEntry,
    variantPrices?: VariantPrice[]
}

export type Product = {
    id?:string,
    productId?: string,
    name: any,
    displayName?: any,
    description?: any,
    sku: string,
    currentPrice?: any,
    regularPrice?: any,
    propertyBag: any,
    parentCategoryIds: any,
    prices?: ProductPrice,
    coverImage?: any,
    definitionName: string,
    variants?: ProductVariant[],
    currentVariantId: string,
    // new Media
    mediaSet?: ProductMedia[],
    variantMediaSet?: VariantMediaSet,
    // old CDN Media
    media?: any,
    variantsMedia?: any
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

export type LookupValue = {
    id: string,
    value: string,
    lookupId: string,
    displayName: any,
    sortOrder: number,
    isActive: boolean,
    isSystem: boolean
}

export type Lookup = {
    lookupName: string,
    values: LookupValue[],
    displayName: any,
    description: string,
    isActive: boolean,
    isSystem: boolean
}

export type DefinitionProperty = {
    propertyName: string,
    displayName: any
    isRequired: boolean,
    displayOrder: number,
    localizable: boolean,
    dataType: string,
    minimumValue: any,
    maximumValue: any,
    isSystem: true,
    includeInAllProductDefinition: true,
    includeInAllCategoryDefinition: true,
    includeInAllVariantDefinition: false,
    groupName: string,
    isHiddenInOrchestrator: boolean,
    isVariant: boolean,
    isVariantGroup: boolean,
    isKeyVariant: boolean,
    isFacettableAdmin: boolean,
    isFacettableWeb: boolean,
    maxMultiplicity: string
}

export type DefinitionPropertyGroup = {
    properties: DefinitionProperty[]
}

export type Definition = {
    name: string,
    displayName: any,
    productType: string,
    sequenceNumber: number,
    properties: DefinitionProperty[],
    propertyGroups: DefinitionPropertyGroup[],
    variantProperties: DefinitionProperty[]
}

export type Metadata = {
    lookups: Lookup[],
    definitions: Definition[]
}

