import type { FulfillmentMethod, FulfillmentMethodType } from 'orc-vsf-api';
import { FulfillmentMethodsGetters } from '../types';

function getFulfillmentMethod(fulfillmentMethods: FulfillmentMethod[], shippingProviderId: string): FulfillmentMethod {
  return fulfillmentMethods?.find(c => c.shippingProviderId === shippingProviderId);
}

function getFulfillmentMethodsGroupedByType(fulfillmentMethods: FulfillmentMethod[]): Record<string, FulfillmentMethod[]> {
  return fulfillmentMethods?.reduce((rv, x) => {
    (rv[x.fulfillmentMethodType] = rv[x.fulfillmentMethodType] || []).push(x);
    return rv;
  }, {});
}

function getFulfillmentMethodType(fulfillmentMethods: FulfillmentMethod[], shippingProviderId: string): FulfillmentMethodType {
  return this.getFulfillmentMethod(fulfillmentMethods, shippingProviderId)?.fulfillmentMethodType;
}

export const fulfillmentMethodsGetters: FulfillmentMethodsGetters<FulfillmentMethod> = {
  getFulfillmentMethod,
  getFulfillmentMethodType,
  getFulfillmentMethodsGroupedByType
};
