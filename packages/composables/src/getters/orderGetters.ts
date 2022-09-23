import { UserOrderGetters, AgnosticPrice } from '@vue-storefront/core';
import type { UserOrder, CartItem, Tax, UserAddress, Cart, PaymentMethod, FulfillmentMethod} from 'orc-vsf-api';

function getDate(order: UserOrder): string {
  return new Date(order?.created).toLocaleDateString() || '';
}

function getId(order: UserOrder): string {
  return order?.id;
}

function getNumber(order: UserOrder): string {
  return order?.orderNumber;
}

function getCustomerName(order: UserOrder): string {
  return order?.customerName;
}

function getCustomerEmail(order: UserOrder): string {
  return order?.cart?.customer?.email;
}

function getStatus(order: UserOrder): string {
  return order?.orderStatus;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPrice(order: UserOrder): number | null {
  return order?.cart?.total;
}

function getItems(order: UserOrder): CartItem[] {
  return order?.cart?.shipments[0]?.lineItems;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemSku(item: CartItem): string {
  return item?.sku;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemName(item: CartItem): string {
  return item?.productSummary?.displayName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemQty(item: CartItem): number {
  return item?.quantity;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemPrice(item: CartItem): number {
  return item?.currentPrice;
}

function getItemPrices(item: CartItem): AgnosticPrice {
  return {
    regular: item?.regularPrice,
    special: item?.currentPrice < item?.regularPrice ? item?.currentPrice : null
  };
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
function getItemTotal(item: CartItem): number {
  return item?.total;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFulfillmentMethod (order: UserOrder): FulfillmentMethod {
  return order?.cart?.shipments[0]?.fulfillmentMethod;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPaymentMethod(order: UserOrder): PaymentMethod {
  return order?.cart?.payments[0]?.paymentMethod;
}

function getPaymentCreditCardNumberLastDigits(order: UserOrder): string {
  return order?.cart?.payments[0]?.propertyBag?.CreditCardNumberLastDigits;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSubTotal(order: UserOrder): number {
  return order?.cart?.subTotal;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTaxes(order: UserOrder): Tax[] {
  return order?.cart?.shipments[0]?.taxes;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTaxTotal(tax: Tax): number {
  return tax?.taxTotal;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTaxName(tax: Tax): string {
  return tax?.displayName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotal(order: UserOrder): number {
  return order?.cart?.total;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShippingAddress(order: UserOrder): UserAddress {
  return order?.cart?.shipments[0]?.address;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPaymentAddress(order: UserOrder): UserAddress {
  return order?.cart?.payments[0]?.billingAddress;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemLink(item: CartItem): string {
  const variantId = item.variantId;
  const productId = item.productId;
  return `/p/${productId}/${item?.productSummary?.displayName}${variantId ? `?variant=${variantId}` : ''}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemImage(item: CartItem): string {
  return item?.coverImage;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShipmentStatus(order: UserOrder): string {
  return order?.cart?.shipments[0]?.status;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShippingPrice(order: UserOrder): number {
  return order?.cart?.fulfillmentCost ?? 0;
}

function getCart(order: UserOrder): Cart {
  return order?.cart;
}

export const orderGetters: UserOrderGetters<UserOrder, CartItem> = {
  getDate,
  getId,
  getCustomerName,
  getCustomerEmail,
  getStatus,
  getPrice,
  getItems,
  getItemSku,
  getItemName,
  getItemImage,
  getItemQty,
  getItemPrice,
  getItemPrices,
  getFormattedPrice,
  getOrdersTotal,
  getItemTotal,
  getFulfillmentMethod,
  getPaymentMethod,
  getSubTotal,
  getTaxes,
  getTaxTotal,
  getTaxName,
  getTotal,
  getShippingAddress,
  getPaymentAddress,
  getItemLink,
  getNumber,
  getShipmentStatus,
  getShippingPrice,
  getCart,
  getPaymentCreditCardNumberLastDigits
};
