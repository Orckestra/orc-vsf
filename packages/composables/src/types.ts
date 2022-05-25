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

export type UseUserUpdateParams = TODO;

export type UseUserRegisterParams = TODO;

export type useUserOrderSearchParams = TODO;

export interface UseStoreErrors {
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
  error: ComputedProperty<UseStoreErrors>;
}

export interface UseMetadata<METADATA> {
  (): UseMetadataInterface<METADATA>;
}

export interface UseMetadataGetters<METADATA, LOOKUP> {
  getLookup(metadata: METADATA, lookupName: string): LOOKUP;
  getLookupValueDisplayName(metadata: METADATA, lookupName: string, lookupValue, locale: string): string;
}

export interface UseMetadataErrors {
  load: Error | null;
  change: Error | null;
}

