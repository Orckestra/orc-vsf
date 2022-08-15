import {
  Context,
  Logger
} from '@vue-storefront/core';
import type {
  Cart,
  CartItem,
  Product,
  PaymentMethod
} from '@vue-storefront/orc-vsf-api';
import { getVariantId } from '../helpers/productUtils';
import { isGuidEmpty, getUserToken } from '../helpers/generalUtils';
import { useCartFactory, UseCartFactoryParams } from '../factories/useCartFactory';
import { cartGetters } from '../getters/cartGetters';

const params: UseCartFactoryParams<Cart, CartItem, Product, PaymentMethod> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context, { customQuery }) => {
    const app = context.$occ.config.app;
    const locale: any = app.i18n.locale;
    Logger.debug('[OCC Storefront]: Loading Cart');
    let userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      // Initiate Guest
      Logger.debug('[OCC Storefront]: Initialize Guest User to be used for Cart');
      userToken = await context.$occ.api.initializeGuestToken();
    }
    if (!userToken) return null;

    let cart = await context.$occ.api.getCart({ ...params, locale });

    const shipment = cart.shipments?.[0] || {};
    const payment = cartGetters.getActivePayment(cart);

    if (cart && (!shipment.fulfillmentLocationId ||
      isGuidEmpty(shipment.fulfillmentLocationId))) {
      // Need to setup fulfilment location for the cart for the items inventory status
      const locations = await context.$occ.api.getInventoryLocations({ includeChildScopes: true });
      const location = locations?.[0];

      if (location) {
        const { id, fulfillmentScheduleMode, fulfillmentScheduledTimeBeginDate, fulfillmentScheduledTimeEndDate, propertyBag, pickUpLocationId } = shipment;
        const updateShipmentRequest = {
          id,
          pickUpLocationId,
          fulfillmentLocationId: location.id,
          fulfillmentMethodName: shipment.fulfillmentMethod?.name,
          shippingAddress: shipment.address,
          fulfillmentScheduleMode,
          fulfillmentScheduledTimeBeginDate,
          fulfillmentScheduledTimeEndDate,
          shippingProviderId: shipment.fulfillmentMethod?.shippingProviderId,
          propertyBag,
          CultureName: locale
        };

        cart = await context.$occ.api.updateCartShipment({ cartName: cart.name, updateShipmentRequest });
      }
    }

    if (cart && !payment) {
      cart = await context.$occ.api.addPayment({ cartName: cart.name });
    }

    Logger.debug('[Result]:', { cart });
    return cart;

  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, { currentCart, product, quantity, customQuery }) => {
    const variantId = getVariantId(product);
    const productId = product.productId ?? product.propertyBag?.ProductId ?? product.id;
    return await context.$occ.api.addCartItem({ ...params, productId, variantId, quantity });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (context: Context, { currentCart, product, customQuery }) => {
    return await context.$occ.api.removeCartItem({ ...params, id: product.id });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateItemQty: async (context: Context, { currentCart, product, quantity, customQuery }) => {
    return await context.$occ.api.updateCartItem({ ...params, id: product.id, quantity });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: async (context: Context, { currentCart, cart }) => {
    const shipment = cart?.shipments?.[0];
    if (!shipment.fulfillmentLocationId ||
      isGuidEmpty(shipment.fulfillmentLocationId)) {
      const locations = await context.$occ.api.getInventoryLocations({ includeChildScopes: true });
      const location = locations?.[0];
      shipment.fulfillmentLocationId = location.id;
    }
    return context.$occ.api.updateCart({ ...params, cart, cartName: currentCart.name });
  },

  updatePaymentMethod: async (context: Context, { currentCart, paymentMethod }) => {
    let payment: any = cartGetters.getActivePayment(currentCart);
    if (payment.paymentStatus !== 'New') {
      await context.$occ.api.removePayment({ paymentId: payment.id, cartName: currentCart.name });
      const cart = await context.$occ.api.addPayment({ cartName: currentCart.name, billingAddress: payment.billingAddress });
      payment = cartGetters.getActivePayment(cart);
    }
    return await context.$occ.api.updatePaymentMethod({ paymentId: payment.id, ...paymentMethod, cartName: currentCart.name });
  },

  initializePayment: async (context: Context, { currentCart, body }) => {
    const payment: any = cartGetters.getActivePayment(currentCart);
    return await context.$occ.api.initializePayment({ paymentId: payment.id, body, cartName: currentCart.name });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentCart }) => {
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    const updatedCart = await context.$occ.api.addCoupon({ ...params, couponCode, cartName: currentCart.name });
    return { updatedCart };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    const updatedCart = await context.$occ.api.removeCoupon({ ...params, couponCode, cartName: currentCart.name });
    return { updatedCart };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInCart: (context: Context, { currentCart, product }) => {
    const getLineItemByProduct = ({ currentCart, product }) => {
      if (product) {
        const productId = product.productId ?? product.propertyBag?.ProductId ?? product.id;
        // TODO: const withVariants = product.variants && product.variants.length;
        // TODO: const variantId = withVariants ? product.variants[0].id : undefined;

        const shipment = currentCart?.shipments?.[0];

        return shipment?.lineItems?.find?.((item) => item.productId === productId);

      }
      return false;
    };

    return Boolean(currentCart && getLineItemByProduct({ currentCart, product }));
  }
};

export const useCart = useCartFactory<Cart, CartItem, Product>(params);
