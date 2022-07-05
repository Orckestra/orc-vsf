import {
  CartGetters,
  AgnosticPrice,
  AgnosticTotals,
  AgnosticCoupon,
  AgnosticDiscount,
  AgnosticAttribute
} from '@vue-storefront/core';
import type { Cart, CartItem, Shipment, Tax, Reward, RewardLevel, ShipmentAdditionalFee } from '@vue-storefront/orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItems(cart: Cart): CartItem[] {
  const shipment = getActiveShipment(cart);
  return shipment?.lineItems;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemName(item: CartItem): string {
  return item?.productSummary.displayName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemImage(item: CartItem): string {
  return item?.coverImage;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemPrice(item: CartItem): AgnosticPrice {
  return {
    regular: item?.regularPrice,
    special: item?.currentPrice < item?.regularPrice ? item?.currentPrice : null
  };
}

function getItemTotals(item: CartItem): AgnosticTotals {
  return {
    total: item?.total,
    subtotal: item?.total,
    special: undefined,
    totalWithoutDiscount: item?.totalWithoutDiscount
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemQty(item: CartItem): number {
  return item?.quantity;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemAttributes(item: CartItem, filterByAttributeName?: Array<string>): Record<string, AgnosticAttribute | string> {
  const result = {
    ...item?.kvaValues
  };

  if (filterByAttributeName) {
    Object.keys(result).forEach(key => {
      if (!filterByAttributeName.includes(key)) {
        delete result[key];
      }
    });
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemSku(item: CartItem): string {
  return item?.sku;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemStatus(item: CartItem): string {
  return item?.status;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotals(cart: Cart): AgnosticTotals {
  return {
    total: cart?.total,
    subtotal: cart?.subTotal,
    special: cart?.subTotal,
    discount: cart?.discountTotal,
    subtotaldiscount: cart?.subTotalDiscount,
    tax: cart?.taxTotal
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShippingPrice(cart: Cart): number {
  return cart?.fulfillmentCost ?? 0;

}

function getActiveShipment(cart: Cart): Shipment {
  return cart?.shipments?.find(s => s.status !== 'Canceled');
}

function getActiveShipments(cart: Cart): Shipment[] {
  return cart?.shipments?.filter(s => s.status !== 'Canceled');
}

function isShippingTaxable(shipment: Shipment): boolean {
  return shipment?.taxes?.some(t => t.taxForShipmentId === shipment.fulfillmentMethod?.shipmentId && t.taxTotal > 0);
}

function isShippingEstimated(shipment: Shipment): boolean {
  return Boolean(shipment?.address?.postalCode);
}

function isActiveShippingEstimated(cart: Cart): boolean {
  const shipment = getActiveShipment(cart);
  return isShippingEstimated(shipment);
}

function isActiveShippingTaxable(cart: Cart): boolean {
  const shipment = getActiveShipment(cart);
  return isShippingTaxable(shipment);
}

function getTaxes(cart: Cart): Tax[] {
  const shipment = getActiveShipment(cart);
  return shipment?.taxes?.filter(t => t.taxTotal > 0);
}

function getRewards(cart: Cart, levels?: RewardLevel[]): Reward[] {
  const shipment = getActiveShipment(cart);
  const rewards = shipment?.rewards;

  if (levels) {
    return rewards?.filter(r => levels.includes(r.level));
  }

  return rewards;
}

function getTaxableAdditionalFees(cart: Cart): ShipmentAdditionalFee[] {
  const shipment = getActiveShipment(cart);
  return shipment?.additionalFees?.filter(f => f.taxable);
}

function getNotTaxableAdditionalFees(cart: Cart): ShipmentAdditionalFee[] {
  const shipment = getActiveShipment(cart);
  return shipment?.additionalFees?.filter(f => !f.taxable);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotalItems(cart: Cart): number {
  return cart?.itemCount;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFormattedPrice(price: number): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCoupons(cart: Cart): AgnosticCoupon[] {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDiscounts(cart: Cart): AgnosticDiscount[] {
  return [];
}

function getItemsDiscountsAmount(cart: Cart): number {
  const items = getItems(cart);
  if (!items) return 0;
  return items.reduce((a, el) => ((el.defaultPrice - el.currentPrice) * el.quantity) + a, 0);
}

function getLink(item: CartItem): string {
  if (!item) return;
  const variantId = item.variantId;
  const productId = item.productId;

  return `/p/${productId}/${item.productSummary.displayName}${variantId ? `?variant=${variantId}` : ''}`;
}

function getShipment(cart: Cart): Shipment {
  return cart.shipments?.[0];
}

export const cartGetters: CartGetters<Cart, CartItem> = {
  getTotals,
  getShippingPrice,
  getItems,
  getItemName,
  getItemImage,
  getItemPrice,
  getItemQty,
  getItemTotals,
  getItemAttributes,
  getItemSku,
  getItemStatus,
  getFormattedPrice,
  getTotalItems,
  getCoupons,
  getDiscounts,
  getItemsDiscountsAmount,
  getLink,
  getActiveShipment,
  getActiveShipments,
  isShippingTaxable,
  isShippingEstimated,
  isActiveShippingEstimated,
  isActiveShippingTaxable,
  getTaxes,
  getRewards,
  getTaxableAdditionalFees,
  getNotTaxableAdditionalFees,
  getShipment
};
