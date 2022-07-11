import { parseUserToken } from '../../../helpers/generalUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getFulfillmentMethods(context, params) {
  const { api, scope, myAccount } = context.config;
  const { locale, cartName = 'Default', userToken } = params;

  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;

  const url = new URL(
    `/api/fulfillmentMethods/${scope}/${customerId}/${cartName}`,
    api.url
  );

  const { data } = await context.client.post(url.href);

  return data?.map((x) => ({
    ...x,
    displayName: x.displayName[locale],
    shippingProviderId: x.shippingProviderId.replaceAll('-', '')
  })) || [];
}
