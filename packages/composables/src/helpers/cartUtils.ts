import type { Cart, CartItem, Message } from 'orc-vsf-api';

export const validateLineItem = (cart: Cart, cartItem: CartItem): boolean => {

  const isMessageForLineItem = (message: Message): boolean => (message.propertyBag?.EntityType === 'LineItem' && message.propertyBag.LineItemId);
  const isErrorMessage = (message: Message): boolean => message.severity === 'Error';

  const hasErrorMassage = cart.messages?.some(message =>
    isErrorMessage(message) &&
    isMessageForLineItem(message) &&
    message.propertyBag.LineItemId.replace(/-/g, '').toUpperCase() === cartItem.id.replace(/-/g, '').toUpperCase());

  if (hasErrorMassage && (!cartItem.status || cartItem.status.toUpperCase() !== 'InStock'.toUpperCase())) return false;
  return true;
};
