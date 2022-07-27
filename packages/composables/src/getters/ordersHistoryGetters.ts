import { UseOrdersHistoryGetters } from '../types';
import type { OrderQueryResult, OrderItem } from '@vue-storefront/orc-vsf-api';
import { AgnosticPagination } from '@vue-storefront/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getOrdersHistory(orderQueryResult: OrderQueryResult): OrderItem[] {
  return orderQueryResult?.results;
}

function getOrdersTotal(orderQueryResult: OrderQueryResult): number {
  return orderQueryResult?.totalCount;
}

function getDate(orderItem: OrderItem): string {
  return new Date(orderItem?.created).toLocaleDateString() || '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getId(orderItem: OrderItem): string {
  return orderItem?.id;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStatus(orderItem: OrderItem): string {
  return orderItem?.orderStatus;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPrice(orderItem: OrderItem): number | null {
  return orderItem?.total;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getNumber(orderItem: OrderItem): string {
  return orderItem?.orderNumber;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPagination(orderQueryResult: OrderQueryResult, itemsPerPage: number, page: number): AgnosticPagination {
  return {
    currentPage: page,
    totalPages: orderQueryResult ? Math.ceil(orderQueryResult?.totalCount / (itemsPerPage)) : 0,
    totalItems: orderQueryResult?.totalCount,
    itemsPerPage: itemsPerPage,
    pageOptions: [12, 24, 48]
  };
}

export const ordersHistoryGetters: UseOrdersHistoryGetters<OrderQueryResult, OrderItem> = {
  getOrdersHistory,
  getOrdersTotal,
  getDate,
  getId,
  getStatus,
  getPrice,
  getNumber,
  getPagination
};
