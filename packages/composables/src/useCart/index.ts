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
import { isGuidEmpty, getUserToken, setUserToken } from '../helpers/generalUtils';
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
      setUserToken(context, userToken);
    }
    if (!userToken) return null;

    let cart = await context.$occ.api.getCart({ ...params, locale, userToken });

    const shipment = cart.shipments && cart.shipments.length ? cart.shipments[0] : {};
    const payment = cartGetters.getActivePayment(cart);

    if (cart && (!shipment.fulfillmentLocationId ||
      isGuidEmpty(shipment.fulfillmentLocationId))) {
      // Need to setup fulfilment location for the cart for the items inventory status
      const locations = await context.$occ.api.getFulfillmentLocations({ includeChildScopes: true, onlyActive: true });
      const location = locations && locations.length ? locations[0] : undefined;

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
          shippingProviderId: shipment.FulfillmentMethod?.ShippingProviderId,
          propertyBag,
          CultureName: locale
        };

        cart = await context.$occ.api.updateCartShipment({ userToken, cartName: cart.name, updateShipmentRequest });
      }
    }

    if (cart && !payment) {
      cart = await context.$occ.api.addPayment({ userToken, cartName: cart.name });
    }

    Logger.debug('[Result]:', { cart });
    return cart;

  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, { currentCart, product, quantity, customQuery }) => {
    const userToken = getUserToken(context);
    const variantId = getVariantId(product);
    const productId = product.productId ?? product.propertyBag?.ProductId ?? product.id;
    return await context.$occ.api.addCartItem({ ...params, userToken, productId, variantId, quantity });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (context: Context, { currentCart, product, customQuery }) => {
    const userToken = getUserToken(context);
    return await context.$occ.api.removeCartItem({ ...params, userToken, id: product.id });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateItemQty: async (context: Context, { currentCart, product, quantity, customQuery }) => {
    const userToken = getUserToken(context);
    return await context.$occ.api.updateCartItem({ ...params, userToken, id: product.id, quantity });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: (context: Context, { currentCart, cart }) => {
    const userToken = getUserToken(context);
    return context.$occ.api.updateCart({ ...params, userToken, cart, cartName: currentCart.name });
  },

  updatePaymentMethod: async (context: Context, { currentCart, paymentMethod }) => {
    const userToken = getUserToken(context);
    const payment: any = cartGetters.getActivePayment(currentCart);
    if (payment.paymentStatus !== 'New') {
      await context.$occ.api.removePayment({ userToken, paymentId: payment.id, cartName: currentCart.name });
      await context.$occ.api.addPayment({ userToken, cartName: currentCart.name });
    }
    return await context.$occ.api.updatePaymentMethod({ userToken, paymentId: payment.id, ...paymentMethod, cartName: currentCart.name });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentCart }) => {
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    const userToken = getUserToken(context);
    const updatedCart = await context.$occ.api.addCoupon({ ...params, userToken, couponCode, cartName: currentCart.name });
    return { updatedCart };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    const userToken = getUserToken(context);
    const updatedCart = await context.$occ.api.removeCoupon({ ...params, userToken, couponCode, cartName: currentCart.name });
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
