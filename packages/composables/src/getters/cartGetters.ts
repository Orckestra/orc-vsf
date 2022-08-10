import {
  CartGetters,
  AgnosticPrice,
  AgnosticTotals,
  AgnosticCoupon,
  AgnosticDiscount,
  AgnosticAttribute
} from '@vue-storefront/core';
import { Cart, CartItem, Shipment, Tax, Reward, RewardLevel, ShipmentAdditionalFee, CouponState, Coupon, Payment, UserAddress, FulfillmentMethod, FulfillmentMethodType } from '@vue-storefront/orc-vsf-api';
import { CustomerSummary } from '@vue-storefront/orc-vsf-api/src';

function getItems(cart: Cart): CartItem[] {
  const shipment = getActiveShipment(cart);
  return shipment?.lineItems;
}

function getItemName(item: CartItem): string {
  return item?.productSummary.displayName;
}

function getItemImage(item: CartItem): string {
  return item?.coverImage;
}

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

function getItemQty(item: CartItem): number {
  return item?.quantity;
}

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

function getItemSku(item: CartItem): string {
  return item?.sku;
}

function getItemStatus(item: CartItem): string {
  return item?.status;
}

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

function getShippingPrice(cart: Cart): number {
  return cart?.fulfillmentCost ?? 0;

}

function getActiveShipment(cart: Cart): Shipment {
  return cart?.shipments?.find(s => s.status !== 'Canceled');
}

function getActiveShipments(cart: Cart): Shipment[] {
  return cart?.shipments?.filter(s => s.status !== 'Canceled');
}
function getFulfillmentMethod(cart: Cart): FulfillmentMethod {
  const shipment = getActiveShipment(cart);
  return shipment?.fulfillmentMethod;
}

function isPickup(cart: Cart): boolean {
  const method = getFulfillmentMethod(cart);
  return method?.fulfillmentMethodType === FulfillmentMethodType.PickUp;
}

function isShipping(cart: Cart): boolean {
  const method = getFulfillmentMethod(cart);
  return method?.fulfillmentMethodType === FulfillmentMethodType.Shipping;
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

function getAllRewards(cart: Cart, levels?: RewardLevel[]): Reward[] {
  const shipment = getActiveShipment(cart);
  let rewards = shipment?.rewards ?? [];
  shipment?.lineItems?.forEach(i => {
    if (i.rewards) {
      rewards = rewards.concat(i.rewards);
    }
  }
  );

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
  const rewards = getAllRewards(cart);
  const validCoupons = cart?.coupons?.filter(c => c.couponState === CouponState.Ok);
  return validCoupons?.map(c => {
    const reward = rewards.find(r => r.promotionId === c.promotionId);
    return ({
      id: c.id,
      name: reward?.promotionName,
      code: c.couponCode,
      value: reward?.amount
    });
  });
}

function getInvalidCoupons(cart: Cart): Coupon[] {
  return cart?.coupons?.filter(c => c.couponState !== CouponState.Ok);
}

function getCouponStateMessages(cart: Cart): string[] {
  const notValidCoupons = getInvalidCoupons(cart);
  return notValidCoupons?.map(c => {
    switch (c.couponState) {
      case CouponState.ValidCouponCannotApply: return `The promotional code ${c.couponCode} is valid, however you don’t meet the promotion’s purchase conditions.`;
      default: return `The promotional code ${c.couponCode} is not valid, has been used or has expired.`;
    }
  });
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

function getActivePayment(cart: Cart): Payment {
  return cart?.payments?.find(p => p.paymentStatus !== 'Voided');
}

function isPersonalDetailsReady(cart: Cart): boolean {
  if (!cart.customer) return false;
  const { firstName, lastName, email } = cart.customer;
  return Boolean(firstName && lastName && email);
}

function isAddressReady(address: UserAddress): boolean {
  if (!address) return false;
  const { line1, city, regionCode, postalCode, phoneNumber } = address;
  return Boolean(line1 && city && regionCode && postalCode && phoneNumber);
}

function isShippingReady(cart: Cart): boolean {
  const activeShipment = getActiveShipment(cart);
  const fulfillemtnMethod = activeShipment?.fulfillmentMethod;
  if (!activeShipment || !fulfillemtnMethod) return false;
  if (fulfillemtnMethod.fulfillmentMethodType === FulfillmentMethodType.PickUp && !activeShipment.pickUpLocationId) return false;
  return isAddressReady(activeShipment.address);
}

function isBillingReady(cart: Cart): boolean {
  const activePayment = getActivePayment(cart);
  if (!activePayment) return false;
  return isAddressReady(activePayment.billingAddress);
}

function isPaymentReady(cart: Cart): boolean {
  const activePayment = getActivePayment(cart);
  if (!activePayment) return false;
  if (!activePayment.paymentMethod) return false;
  return isAddressReady(activePayment.billingAddress);
}

function isReadyForOrder(cart: Cart): boolean {
  if (!cart || !cart.itemCount || !cart.customer) return false;

  if (!isPersonalDetailsReady(cart)) return false;

  if (!isPersonalDetailsReady(cart)) return false;

  if (!isShippingReady(cart)) return false;

  if (!isPaymentReady(cart)) return false;

  return true;
}

function getCustomer(cart: Cart): CustomerSummary | any {
  return cart?.customer || {};
}

function getUnavailableItems(cart: Cart): CartItem[] {
  return cart.shipments[0].lineItems.filter(item => item.status === 'OutOfStock');
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
  getInvalidCoupons,
  getCouponStateMessages,
  getDiscounts,
  getItemsDiscountsAmount,
  getLink,
  getActiveShipment,
  getFulfillmentMethod,
  isPickup,
  isShipping,
  getActiveShipments,
  isShippingTaxable,
  isShippingEstimated,
  isActiveShippingEstimated,
  isActiveShippingTaxable,
  getTaxes,
  getRewards,
  getTaxableAdditionalFees,
  getNotTaxableAdditionalFees,
  getActivePayment,
  isPersonalDetailsReady,
  isShippingReady,
  isBillingReady,
  isAddressReady,
  isPaymentReady,
  isReadyForOrder,
  getCustomer,
  getUnavailableItems
};
