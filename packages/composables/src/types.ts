import {
  ProductsSearchParams,
  FactoryParams,
  Context,
  ComputedProperty,
  AgnosticPagination
} from '@vue-storefront/core';
import {
  AgnosticAttribute, AgnosticCoupon, AgnosticDiscount,
  AgnosticPrice, AgnosticTotals,
  Composable,
  CustomQuery,
  PlatformApi
} from '@vue-storefront/core/lib/src/types';
import { FulfillmentMethodType, Payment } from '@vue-storefront/orc-vsf-api';

export type TODO = any;

export type UseBillingAddParams = TODO;

export type UseCategorySearchParams = TODO;

export type UseFacetSearchParams = TODO;

export type UseProductSearchParams = ProductsSearchParams;

export type UseReviewSearchParams = TODO;

export type UseReviewAddParams = TODO;

export type UseShippingAddParams = TODO;

export type UseStoreFilterParams = TODO;

export type UserUpdateParams = {
  cellNumber: string;
  customerType: string;
  email: string;
  faxExtension: string;
  faxNumber: string;
  firstname: string;
  language: string;
  lastname: string;
  passwordQuestion: string;
  phoneExtension: string;
  phoneExtensionWork: string;
  phoneNumber: string;
  phoneNumberWork: string;
  username: string;
}

export type UserRegisterParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type useUserOrderSearchParams = TODO;

export type ResponseStatus = {
  errorCode: string;
  message: string;
}

export type ResponseData = {
  responseStatus: ResponseStatus;
}

/*
INVENTORY
*/
export interface UseInventoryErrors {
  load: Error | null;
  change: Error | null;
}

export interface UseInventoryFactoryParams<INVENTORYITEM> extends FactoryParams {
  find(context: Context, skus: string[]): Promise<INVENTORYITEM>
}

export interface UseInventoryInterface<INVENTORYITEM> {
  find(skus: string[]): Promise<void>;
  loading: ComputedProperty<boolean>;
  result: ComputedProperty<INVENTORYITEM>;
  error: ComputedProperty<UseInventoryErrors>;
}

export interface UseInventory<INVENTORYITEM> {
  (): UseInventoryInterface<INVENTORYITEM>;
}

export interface UseInventoryGetters<INVENTORYITEM> {
  getProductSkusAvailableToSell(items: INVENTORYITEM[], availableInventoryStatuses: string[]): string[];
  getSkuAvailableQuantity(items: INVENTORYITEM[], sku: string): number;
  getSkuStatus(items: INVENTORYITEM[], sku: string): string;
}

export const enum InventoryStatus {
  InStock = 0,
  OutOfStock = 1,
  PreOrder = 2,
  BackOrder = 3
}

/*
ORDERSHISTORY
*/

export interface UseOrdersHistoryGetters<ORDERQUERYRESULT, ORDERITEM> {
  getOrdersHistory(orders: ORDERQUERYRESULT): ORDERITEM[];
  getOrdersTotal(orders: ORDERQUERYRESULT): number;
  getDate(orderItem: ORDERITEM): string;
  getId(orderItem: ORDERITEM): string;
  getStatus(orderItem: ORDERITEM): string;
  getPrice(orderItem: ORDERITEM): number | null;
  getNumber(orderItem: ORDERITEM): string;
  getPagination(orders: ORDERQUERYRESULT, itemsPerPage: number, page: number): AgnosticPagination;
}

/*
METADATDA
*/
export interface UseMetadataErrors {
  load: Error | null;
  change: Error | null;
}

export interface UseMetadataFactoryParams<METADATA> extends FactoryParams {
  load(context: Context): Promise<METADATA>
}

export interface UseMetadataInterface<METADATA> {
  load(): Promise<void>;
  loading: ComputedProperty<boolean>;
  response: ComputedProperty<METADATA>;
  error: ComputedProperty<UseMetadataErrors>;
}

export interface UseMetadata<METADATA> {
  (): UseMetadataInterface<METADATA>;
}

export interface UseMetadataGetters<METADATA, LOOKUP> {
  getLookup(metadata: METADATA, lookupName: string): LOOKUP;
  getLookupValueDisplayName(metadata: METADATA, lookupName: string, lookupValue, locale: string): string;
}

/*
CONFIGURATION
*/

export interface UseConfigurationFactoryParams<CONFIGURATION> extends FactoryParams {
  load(context: Context): Promise<CONFIGURATION>
}

export interface UseConfigurationErrors {
  load: Error | null;
  change: Error | null;
}

export interface useConfigurationInterface<CONFIGURATION> {
  load(): Promise<void>;
  loading: ComputedProperty<boolean>;
  response: ComputedProperty<CONFIGURATION>;
  error: ComputedProperty<UseConfigurationErrors>;
}

export interface useConfiguration<CONFIGURATION> {
  (): useConfigurationInterface<CONFIGURATION>;
}

export interface UseConfigurationGetters<CONFIGURATION, MEMBERSHIPCONFIGURATION> {
  getMinRequiredPasswordLength(config: CONFIGURATION): number;
  getMinRequiredNonAlphanumericCharacters(config: CONFIGURATION): number;
  getMembershipConfiguration(config: CONFIGURATION): MEMBERSHIPCONFIGURATION;
}

/*
COUNTRIES
*/
export interface UseCountriesErrors {
  load: Error | null;
  change: Error | null;
}

export interface UseCountriesFactoryParams<COUNTRIES> extends FactoryParams {
  load(context: Context): Promise<COUNTRIES>
}

export interface UseCountriesInterface<COUNTRIES> {
  load(): Promise<void>;
  loading: ComputedProperty<boolean>;
  countries: ComputedProperty<COUNTRIES>;
  error: ComputedProperty<UseCountriesErrors>;
}

export interface UseCountries<COUNTRIES> {
  (): UseCountriesInterface<COUNTRIES>;
}
export interface CountriesGetters<COUNTRY, REGION> {
  getCountry(countries: COUNTRY[], countryCode: string): COUNTRY;
  getCountryName(countries: COUNTRY[], countryCode: string): string;
  getCountryRegion(countries: COUNTRY[], countryCode: string, regionCode: string): REGION;
  getCountryRegionName(countries: COUNTRY[], countryCode: string, regionCode: string): string;
  getRegions(countries: COUNTRY[], countryCode: string): REGION[];
}

/*
ADDRESSES
*/
export interface UseUserAddressesErrors {
  addAddress: Error;
  deleteAddress: Error;
  updateAddress: Error;
  load: Error;
  setDefaultAddress: Error;
  setDefaultShipping: Error;
  setDefaultBilling: Error;
}
export interface UseUserAddresses<USER_ADDRESS_ITEM, API extends PlatformApi = any> extends Composable<API> {
  addresses: ComputedProperty<USER_ADDRESS_ITEM[]>;
  addAddress: (params: {
    address: USER_ADDRESS_ITEM;
    customQuery?: CustomQuery;
  }) => Promise<void>;
  deleteAddress: (params: {
    address: USER_ADDRESS_ITEM;
    customQuery?: CustomQuery;
  }) => Promise<void>;
  updateAddress: (params: {
    address: USER_ADDRESS_ITEM;
    customQuery?: CustomQuery;
  }) => Promise<void>;
  load: () => Promise<void>;
  setDefaultAddress: (params: {
    address: USER_ADDRESS_ITEM;
    customQuery?: CustomQuery;
  }) => Promise<void>;
  setDefaultShipping: (params: {
    address: USER_ADDRESS_ITEM;
    customQuery?: CustomQuery;
  }) => Promise<void>;
  setDefaultBilling: (params: {
    address: USER_ADDRESS_ITEM;
    customQuery?: CustomQuery;
  }) => Promise<void>;
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UseUserAddressesErrors>;
}

export interface UserAddressGetters<USER_ADDRESS_ITEM> {
  getDefault: (addresses: USER_ADDRESS_ITEM[]) => USER_ADDRESS_ITEM;
  getDefaultShipping: (addresses: USER_ADDRESS_ITEM[]) => USER_ADDRESS_ITEM;
  getDefaultBilling: (addresses: USER_ADDRESS_ITEM[]) => USER_ADDRESS_ITEM;
  getTotal: (addresses: USER_ADDRESS_ITEM[]) => number;
  getPostCode: (address: USER_ADDRESS_ITEM) => string;
  getStreetName: (address: USER_ADDRESS_ITEM) => string;
  getStreetNumber: (address: USER_ADDRESS_ITEM) => string | number;
  getCity: (address: USER_ADDRESS_ITEM) => string;
  getFirstName: (address: USER_ADDRESS_ITEM) => string;
  getLastName: (address: USER_ADDRESS_ITEM) => string;
  getCountry: (address: USER_ADDRESS_ITEM) => string;
  getPhone: (address: USER_ADDRESS_ITEM) => string;
  getEmail: (address: USER_ADDRESS_ITEM) => string;
  getProvince: (address: USER_ADDRESS_ITEM) => string;
  getCompanyName: (address: USER_ADDRESS_ITEM) => string;
  getTaxNumber: (address: USER_ADDRESS_ITEM) => string;
  getId: (address: USER_ADDRESS_ITEM) => string | number;
  getApartmentNumber: (address: USER_ADDRESS_ITEM) => string | number;
  isDefault: (address: USER_ADDRESS_ITEM) => boolean;
  isDefaultShipping: (address: USER_ADDRESS_ITEM) => boolean;
  isDefaultBilling: (address: USER_ADDRESS_ITEM) => boolean;
}

/*
CART
*/
export interface UseCartErrors {
  addItem: Error;
  removeItem: Error;
  update: Error;
  updateItemQty: Error;
  load: Error;
  clear: Error;
  applyCoupon: Error;
  removeCoupon: Error;
}
export interface UseCart<CART, CART_ITEM, PRODUCT, PAYMENTMETHOD, API extends PlatformApi = any> extends Composable<API> {
  cart: ComputedProperty<CART>;
  setCart(cart: CART): void;
  addItem(params: {
    product: PRODUCT;
    quantity: number;
    customQuery?: CustomQuery;
  }): Promise<void>;
  isInCart: ({ product: PRODUCT }: {
    product: any;
  }) => boolean;
  removeItem(params: {
    product: CART_ITEM;
    customQuery?: CustomQuery;
  }): Promise<void>;
  update: (params: {
    cart: CART;
  }) => Promise<void>;
  updatePaymentMethod: (params: {
    paymentMethod: PAYMENTMETHOD;
  }) => Promise<void>;
  updateItemQty(params: {
    product: CART_ITEM;
    quantity?: number;
    customQuery?: CustomQuery;
  }): Promise<void>;
  clear(): Promise<void>;
  applyCoupon(params: {
    couponCode: string;
    customQuery?: CustomQuery;
  }): Promise<void>;
  removeCoupon(params: {
    couponCode: string;
    customQuery?: CustomQuery;
  }): Promise<void>;
  load(): Promise<void>;
  load(params: {
    customQuery?: CustomQuery;
  }): Promise<void>;
  error: ComputedProperty<UseCartErrors>;
  loading: ComputedProperty<boolean>;
}

/*
STORES
*/

export type UseStoresSearchParams = {
  locale: string,
  page: number,
  itemsPerPage: number
};

export interface UseStoresErrors {
  search: Error;
}

export interface UseStores<STORES, STORES_SEARCH_PARAMS, API extends PlatformApi = any> extends Composable<API> {
  stores: ComputedProperty<STORES>;
  search(params: STORES_SEARCH_PARAMS): Promise<any>;
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UseStoresErrors>;
}

export interface UseStoresFactoryParams<STORES, STORES_SEARCH_PARAMS> extends FactoryParams {
  search(context: Context, params: STORES_SEARCH_PARAMS): Promise<STORES>;
}

export interface UseStoresGetters<STORES> {
  getStores(stores: any): STORES;
  getStoresForPickUp(stores: any): STORES;
}

/*
Fulfillment location
*/

export type UseGetFulfillmentLocationParams = {
  locale: string,
  locationId: number
};

export interface UseGetFulfillmentLocationErrors {
  getLocation: Error;
}

export interface UseGetFulfillmentLocation<FULFILLMENTLOCATION, FULFILLMENTLOCATION_GET_PARAMS, API extends PlatformApi = any> extends Composable<API> {
  response: ComputedProperty<FULFILLMENTLOCATION>;
  getLocation(params: FULFILLMENTLOCATION_GET_PARAMS): Promise<any>;
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UseStoresErrors>;
}

export interface UseGetFulfillmentLocationFactoryParams<FULFILLMENTLOCATION, FULFILLMENTLOCATION_GET_PARAMS> extends FactoryParams {
  getLocation(context: Context, params: FULFILLMENTLOCATION_GET_PARAMS): Promise<FULFILLMENTLOCATION>;
}

/*
ORDER
*/

export interface UseOrderFactoryParams<ORDER> extends FactoryParams {
  find(context: Context, orderNumber: string[]): Promise<ORDER>
}

export interface UseOrderErrors {
  load: Error | null;
  change: Error | null;
}

export interface useOrderInterface<ORDER> {
  find(orderNumber: string[]): Promise<void>;
  loading: ComputedProperty<boolean>;
  response: ComputedProperty<ORDER>;
  error: ComputedProperty<UseOrderErrors>;
}

export interface useOrder<ORDER> {
  (): useOrderInterface<ORDER>;
}

export interface UseOrderGetters<ORDER, PRODUCTS> {
  getOrderProducts(config: ORDER): PRODUCTS;
}

export interface CartGetters<CART, CART_ITEM> {
  getItems: (cart: CART) => CART_ITEM[];
  getItemName: (cartItem: CART_ITEM) => string;
  getItemImage: (cartItem: CART_ITEM) => string;
  getItemPrice: (cartItem: CART_ITEM) => AgnosticPrice;
  getItemQty: (cartItem: CART_ITEM) => number;
  getItemAttributes: (cartItem: CART_ITEM, filters?: Array<string>) => Record<string, AgnosticAttribute | string>;
  getItemSku: (cartItem: CART_ITEM) => string;
  getTotals: (cart: CART) => AgnosticTotals;
  getShippingPrice: (cart: CART) => number;
  getTotalItems: (cart: CART) => number;
  getFormattedPrice: (price: number) => string;
  getCoupons: (cart: CART) => AgnosticCoupon[];
  getDiscounts: (cart: CART) => AgnosticDiscount[];
  getActivePayment: (cart: CART) => Payment;
  [getterName: string]: (element: any, options?: any) => unknown;
}

/*
UsePaymentMethods
*/
export interface UsePaymentMethodsErrors {
  load: Error | null;
  change: Error | null;
}

export interface UsePaymentMethodsFactoryParams<PAYMENTMETHOD> extends FactoryParams {
  load(context: Context, { providerName }): Promise<PAYMENTMETHOD>
}

export interface UsePaymentMethodsInterface<PAYMENTMETHOD> {
  load(context: any, { providerName }): Promise<void>;
  loading: ComputedProperty<boolean>;
  methods: ComputedProperty<PAYMENTMETHOD[]>;
  error: ComputedProperty<UsePaymentMethodsErrors>;
}

export interface UsePaymentMethods<PAYMENTMETHOD> {
  (id: string): UsePaymentMethodsInterface<PAYMENTMETHOD>;
}

export interface UsePaymentMethodsGetters<PAYMENTMETHOD> {
  getMethods(): PAYMENTMETHOD[];
}

export interface PaymentMethodGetters<PAYMENTMETHOD> {
  getDefaultMethod(methods: PAYMENTMETHOD[]): PAYMENTMETHOD;
  getValidPaymentMethods(methods: PAYMENTMETHOD[]): PAYMENTMETHOD[];
}

/*
FULFILLMENT METHODS
*/
export interface UseFulfillmentMethodsErrors {
  load: Error | null;
}

export interface UseFulfillmentMethodsFactoryParams<METHOD> extends FactoryParams {
  load(context: Context): Promise<METHOD[]>
}

export interface UseFulfillmentMethodsInterface<METHOD> {
  load(): Promise<void>;
  loading: ComputedProperty<boolean>;
  fulfillmentMethods: ComputedProperty<METHOD[]>;
  error: ComputedProperty<UseFulfillmentMethodsErrors>;
}

export interface UseFulfillmentMethods<METHOD> {
  (): UseFulfillmentMethodsInterface<METHOD>;
}

export interface FulfillmentMethodsGetters<METHOD> {
  getFulfillmentMethod(fulfillmentMethods: METHOD[], shippingProviderId: string): METHOD;
  getFulfillmentMethodType(fulfillmentMethods: METHOD[], shippingProviderId: string): FulfillmentMethodType
}
