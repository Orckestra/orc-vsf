import type { Cart, CartItem, Message } from '@vue-storefront/orc-vsf-api';

export const validateLineItem = (cart: Cart, cartItem: CartItem): boolean => {

  const isMessageForLineItem = (message: Message): boolean => {
    return message.propertyBag != null &&
        message.propertyBag.EntityType !== undefined &&
        message.propertyBag.EntityType === 'LineItem' &&
        message.propertyBag.LineItemId;
  };

  const isErrorMessage = (message: Message): boolean => {
    return message.severity === 'Error';
  };

  const filteredLineItems = cart.messages.filter(item => isErrorMessage(item) && isMessageForLineItem(item));
  const erronousLineItems = filteredLineItems.reduce((result, currentValue) => {
    (result[currentValue.propertyBag.LineItemId] = result[currentValue.propertyBag.LineItemId] || []).push(
      currentValue
    );
    return result;
  }, {});
  const groups = Object.keys(erronousLineItems).map(key => ({
    key: key,
    value: erronousLineItems[key]
  }));
  const group = groups.find(item => item.key.replace(/-/g, '') === cartItem.id);
  return group && cartItem.status && cartItem.status !== 'InStock';
};
