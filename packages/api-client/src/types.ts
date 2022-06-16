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

export type PasswordResetResult = {
    success: boolean;
};

export type ProductVariant = {
    active?: boolean,
    id: string,
    sku: string,
    displayName?: any,
    propertyBag?: any,
    media?: any,
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
    variantsMedia?: any,
    relationships?: any
};

export const enum ProductsQueryType {
    List = 'LIST',
    Detail = 'DETAIL'
}

export type ProductFilter = TODO;

export type Review = TODO;

export type ReviewItem = TODO;

export type User = {
    email?: string,
    firstName?: string,
    lastName?: string,
};

export type UserBillingAddress = TODO;

export type UserBillingAddressItem = TODO;

export type UserBillingAddressSearchCriteria = TODO;

export type UserAddress = {
    addressName: string,
    city: string,
    countryCode: string,
    email: string,
    firstName: string,
    id: string,
    isPreferredBilling: boolean,
    isPreferredShipping: boolean,
    lastModified: string,
    lastModifiedBy: string,
    lastName: string,
    latitude: number,
    line1: string,
    line2: string,
    longitude: number,
    notes: string,
    phoneExtension: string,
    phoneNumber: string,
    postalCode: string,
    propertyBag: object
    regionCode: string
};

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

export type InventoryItemIdentifier = {
    inventoryLocationId: string,
    sku: string
}

export type InventoryItemStatus = {
    quantity: number,
    // InStock, OutOfStock, PreOrder, BackOrder
    status:	string
}

export type InventoryItemAvailability = {
    date: string,
    identifier: InventoryItemIdentifier,
    statuses: InventoryItemStatus[]
}

export type MembershipConfiguration = {
    minRequiredPasswordLength: number,
    minRequiredNonAlphanumericCharacters: number,
    accountLockDownMinutes: number,
    enablePasswordReset: boolean,
    enablePasswordRetrieval: boolean,
    maxInvalidPasswordAttempts: number,
    passwordAttemptWindow: number,
    passwordFailedAttemptDelaySeconds: number,
    passwordStrategy: string,
    passwordStrengthRegularExpression: string,
    requiresQuestionAndAnswer: boolean,
    requiresUniqueEmail: boolean,
    tokenExpirationMinutes: number
}

export type Configuration = {
    membership: MembershipConfiguration
}

export type RegionItem = {
    name: string
    sortOrder: number,
    isoCode: string,
    isSupported: boolean,
    id: string,
}

export type CountryItem = {
    name: string,
    sortOrder: number,
    isoCode: string,
    regions: RegionItem[]
    isSupported: boolean,
    id: string,
    phoneRegex: string,
    postalCodeRegex: string
}

