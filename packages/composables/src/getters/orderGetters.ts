import { UserOrderGetters } from '@vue-storefront/core';
import type { UserOrder, OrderItem, CartItem, Tax, UserAddress} from '@vue-storefront/orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDate(order: UserOrder): string {
  return order.created;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getId(order: UserOrder): string {
  return order.id;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStatus(order: UserOrder): string {
  return order.orderStatus;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPrice(order: UserOrder): number | null {
  return order.cart.total;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItems(order: UserOrder): OrderItem[] {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemSku(item: OrderItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemName(item: OrderItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemQty(item: OrderItem): number {
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemPrice(item: OrderItem): number {
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFormattedPrice(price: number): string {
  return '';
}

// eslint-disable-next-line
function getOrdersTotal(orders: any): number {
  return 1;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProducts(order: UserOrder): CartItem[] {
  return order.cart.shipments[0]?.lineItems;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProductQty(item: CartItem): number {
  return item.quantity;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProductPrice(item: CartItem): number {
  return item.listPrice;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProductSku(item: CartItem): string {
  return item.sku;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProductName(item: CartItem): string {
  return item.productSummary.displayName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProductRegularPrice(item: CartItem): number {
  return item.regularPrice;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFulfillmentMethodName(order: UserOrder): string {
  console.log(order.cart.shipments[0]?.fulfillmentMethod.name);
  return order.cart.shipments[0]?.fulfillmentMethod.name;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPaymentMethod(order: UserOrder): string {
  return order.cart.payments[0].paymentMethod.type;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSubTotal(order: UserOrder): number {
  return order.cart.subTotal;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTaxes(order: UserOrder): Tax[] {
  return order.cart.shipments[0]?.taxes;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTaxTotal(tax: any): number {
  return tax.taxTotal;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTaxName(tax: any, locale: string): string {
  return tax.displayName?.[locale];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotal(order: UserOrder): number {
  return order.cart.total;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSaving(order: UserOrder): number {
  let saving = 0;
  order.cart.shipments[0]?.lineItems.forEach(item => saving += item.regularPrice - item.listPrice );
  return saving;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShippingAddress(order: UserOrder): UserAddress {
  return order.cart.shipments[0]?.address;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPaymentAddress(order: UserOrder): UserAddress {
  return order.cart.payments[0].billingAddress;
}

export const orderGetters: UserOrderGetters<UserOrder, OrderItem> = {
  getDate,
  getId,
  getStatus,
  getPrice,
  getItems,
  getItemSku,
  getItemName,
  getItemQty,
  getItemPrice,
  getFormattedPrice,
  getOrdersTotal,
  getProducts,
  getProductQty,
  getProductPrice,
  getProductSku,
  getProductName,
  getProductRegularPrice,
  getFulfillmentMethodName,
  getPaymentMethod,
  getSubTotal,
  getTaxes,
  getTaxTotal,
  getTaxName,
  getTotal,
  getSaving,
  getShippingAddress,
  getPaymentAddress
};
