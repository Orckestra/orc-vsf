import { UserOrderGetters } from '@vue-storefront/core';
import type { Order, OrderItem, LineItem } from '@vue-storefront/orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDate(order: Order): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getId(order: Order): string {
  return '1';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStatus(order: Order): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPrice(order: Order): number | null {
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItems(order: Order): LineItem[] {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemSku(item: LineItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemName(item: LineItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemQty(item: LineItem): number {
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemPrice(item: LineItem): number {
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

export const orderGetters: UserOrderGetters<Order, LineItem> = {
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
  getOrdersTotal
};
