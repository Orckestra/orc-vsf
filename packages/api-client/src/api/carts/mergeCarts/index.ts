import { setCartItemsCoverImages } from '../../../helpers/mediaUtils';
import { parseUserToken } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function mergeCarts(context, params) {

  const { api, scope, myAccount } = context.config;
  const { userTokenFrom, userTokenTo, cartName = 'Default' } = params;
  const { id: customerIdFrom } = parseUserToken(userTokenFrom, myAccount.secretPassphrase);
  const { id: customerIdTo } = parseUserToken(userTokenTo, myAccount.secretPassphrase);
  if (!customerIdFrom || !customerIdTo) return null;

  const urlFrom = new URL(`/api/carts/${scope}/${customerIdFrom}/${cartName}`, api.url);
  const urlTo = new URL(`/api/carts/${scope}/${customerIdFrom}/${cartName}`, api.url
  );

  const { data: cartFrom } = await context.client.get(urlFrom.href);
  const { data: cartTo } = await context.client.get(urlTo.href);

  if (!cartFrom || !cartTo || !cartFrom.shipments || cartFrom.shipments.length === 0
    || !cartFrom.shipments[0].lineItems || cartFrom.shipments[0].lineItems.length === 0) {
    return cartTo;
  }

  const lineItemsFrom = cartFrom.shipments[0].lineItems;
  const urlAddLineitems = new URL(`/api/carts/${scope}/${customerIdTo}/${cartName}/lineItems/batch`, api.url);
  const { data: updatedCartTo } = await context.client.post(urlAddLineitems.href, {
    lineItems: lineItemsFrom
  });

  return updatedCartTo;
}
