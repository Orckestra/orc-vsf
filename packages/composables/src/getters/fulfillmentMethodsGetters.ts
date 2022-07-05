import type { FulfillmentMethodInfo, FulfillmentMethodType } from '@vue-storefront/orc-vsf-api';
import { FulfillmentMethodsGetters } from '../types';

function getFulfillmentMethod(fulfillmentMethods: FulfillmentMethodInfo[], shippingProviderId: string): FulfillmentMethodInfo {
  return fulfillmentMethods?.find(c => c.shippingProviderId === shippingProviderId);
}

function getFulfillmentMethodType(fulfillmentMethods: FulfillmentMethodInfo[], shippingProviderId: string): FulfillmentMethodType {
  return this.getFulfillmentMethod(fulfillmentMethods, shippingProviderId)?.fulfillmentMethodType;
}

export const fulfillmentMethodsGetters: FulfillmentMethodsGetters<FulfillmentMethodInfo> = {
  getFulfillmentMethod,
  getFulfillmentMethodType
};
