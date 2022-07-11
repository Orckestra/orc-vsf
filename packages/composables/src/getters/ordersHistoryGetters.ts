import { UseOrdersHistoryGetters } from '../types';
import type { OrderQueryResult, OrderItem } from '@vue-storefront/orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getOrdersHistory(orderQueryResult: OrderQueryResult): OrderItem[] {
  console.log(orderQueryResult?.results)
  return orderQueryResult?.results;
}

function getOrdersTotal(orderQueryResult: OrderQueryResult): number {
  return orderQueryResult?.totalCount;
}

function getDate(orderItem: OrderItem): string {
  return orderItem.created;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getId(orderItem: OrderItem): string {
  return orderItem.id;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStatus(orderItem: OrderItem): string {
  return orderItem.orderStatus;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPrice(orderItem: OrderItem): number | null {
  return orderItem.total;
}

function getNumber(orderItem: OrderItem): string {
  return orderItem.orderNumber;
}

export const ordersHistoryGetters: UseOrdersHistoryGetters<OrderQueryResult, OrderItem> = {
  getOrdersHistory,
  getOrdersTotal,
  getDate,
  getId,
  getStatus,
  getPrice,
  getNumber
};
