import {
  ProductsSearchParams,
  FactoryParams,
  Context,
  ComputedProperty
} from '@vue-storefront/core';
import { Composable, CustomQuery, PlatformApi } from '@vue-storefront/core/lib/src/types';

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
  getMembershipConfiguration(config: CONFIGURATION) : MEMBERSHIPCONFIGURATION;
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
export interface CountriesGetters<COUNTRIES, REGIONS> {
  getRegions(countries: COUNTRIES, countryCode: string): REGIONS;
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
export interface UseCart<CART, CART_ITEM, PRODUCT, API extends PlatformApi = any> extends Composable<API> {
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
