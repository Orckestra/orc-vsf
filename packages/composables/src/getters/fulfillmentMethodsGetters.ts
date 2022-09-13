import type { FulfillmentMethod, FulfillmentMethodType } from 'orc-vsf-api';
import { FulfillmentMethodsGetters } from '../types';

function getFulfillmentMethod(fulfillmentMethods: FulfillmentMethod[], shippingProviderId: string): FulfillmentMethod {
  return fulfillmentMethods?.find(c => c.shippingProviderId === shippingProviderId);
}

function getFulfillmentMethodType(fulfillmentMethods: FulfillmentMethod[], shippingProviderId: string): FulfillmentMethodType {
  return this.getFulfillmentMethod(fulfillmentMethods, shippingProviderId)?.fulfillmentMethodType;
}

export const fulfillmentMethodsGetters: FulfillmentMethodsGetters<FulfillmentMethod> = {
  getFulfillmentMethod,
  getFulfillmentMethodType
};
