import {
  ProductsSearchParams,
  FactoryParams,
  Context,
  ComputedProperty
} from '@vue-storefront/core';

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
