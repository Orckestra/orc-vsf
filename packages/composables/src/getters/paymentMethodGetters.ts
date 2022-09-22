import { PaymentMethodGetters } from '../types';
import { PaymentMethod } from '@vue-storefront/orc-vsf-api';

function getDefaultMethod(methods: PaymentMethod[]): PaymentMethod {
  return methods?.find(m => m.default && m.enabled) ?? methods?.find(m => m.enabled);
}

function getValidPaymentMethods(methods: PaymentMethod[]): PaymentMethod[] {
  if (!methods || !Array.isArray(methods)) return [];
  return methods.filter(m => m.enabled);
}

export const paymentMethodGetters: PaymentMethodGetters<PaymentMethod> = {
  getDefaultMethod,
  getValidPaymentMethods
};
