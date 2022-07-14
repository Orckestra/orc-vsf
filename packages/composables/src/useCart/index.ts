import {
  Context,
  useCartFactory,
  UseCartFactoryParams,
  Logger
} from '@vue-storefront/core';
import type {
  Cart,
  CartItem,
  Product
} from '@vue-storefront/orc-vsf-api';
import { getVariantId } from '../helpers/productUtils';
import { isGuidEmpty, getUserToken } from '../helpers/generalUtils';

const params: UseCartFactoryParams<Cart, CartItem, Product> = {
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

    if (userToken) {

      let cart = await context.$occ.api.getCart({ ...params, locale, userToken });

      const shipment = cart.shipments && cart.shipments.length ? cart.shipments[0] : {};

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

          cart = await context.$occ.api.updateCartShipment({ cartName: cart.name, updateShipmentRequest });
        }
      }
      Logger.debug('[Result]:', { cart });
      return cart;
    }

    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, { currentCart, product, quantity, customQuery }) => {
    const variantId = getVariantId(product);
    return await context.$occ.api.addCartItem({ ...params, productId: product.productId ?? product.id, variantId, quantity });
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
  clear: async (context: Context, { currentCart }) => {
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    console.log('Mocked: useCart.applyCoupon');
    return {
      updatedCart: null,
      updatedCoupon: {}
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    console.log('Mocked: useCart.removeCoupon');
    return {
      updatedCart: null
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInCart: (context: Context, { currentCart, product }) => {
    const getLineItemByProduct = ({ currentCart, product }) => {
      if (product) {
        const productId = product.productId ?? product.id;
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
