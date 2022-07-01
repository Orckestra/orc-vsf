import { UseOrdersHistoryGetters } from '../types';
import type { OrderItem } from '@vue-storefront/orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getOrdersHistory(orders: OrderItem[]): any {
  let ordersItems = [];
  orders.forEach((orderItem: OrderItem) => {
    ordersItems.push([orderItem.orderNumber, orderItem.created, orderItem.total, orderItem.orderStatus])
  });
}

export const ordersHistoryGetters: UseOrdersHistoryGetters<OrderItem> = {
  getOrdersHistory
};
