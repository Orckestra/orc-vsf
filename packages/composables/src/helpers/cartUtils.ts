import type { Cart, CartItem, Message } from '@vue-storefront/orc-vsf-api';

export const validateLineItem = (cart: Cart, cartItem: CartItem): boolean => {

  const isMessageForLineItem = (message: Message): boolean => {
    return message.propertyBag &&
      message.propertyBag.LineItemId &&
      message.propertyBag.EntityType &&
      message.propertyBag.EntityType === 'LineItem';
  };

  const isErrorMessage = (message: Message): boolean => {
    return message.severity === 'Error';
  };

  const hasErrorMassage = cart.messages?.some(message =>
    isErrorMessage(message) &&
    isMessageForLineItem(message) &&
    message.propertyBag.LineItemId.replace(/-/g, '').toUpperCase() === cartItem.id.replace(/-/g, '').toUpperCase());

  if (hasErrorMassage && (!cartItem.status || cartItem.status.toUpperCase() !== 'InStock'.toUpperCase())) return false;
  return true;
};
