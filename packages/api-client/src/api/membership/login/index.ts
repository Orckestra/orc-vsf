const mergeCarts = async (context, params) => {
  const { api, scope } = context.config;
  const { customerIdFrom, customerIdTo, cartName = 'Default' } = params;

  if (!customerIdFrom) {
    throw new Error('customerIdFrom is empty');
  }

  if (!customerIdTo) {
    throw new Error('customerIdTo is empty');
  }

  const urlFrom = new URL(
    `/api/carts/${scope}/${customerIdFrom}/${cartName}`,
    api.url
  );
  const urlTo = new URL(
    `/api/carts/${scope}/${customerIdTo}/${cartName}`,
    api.url
  );

  const { data: cartFrom } = await context.client.get(urlFrom.href);
  const { data: cartTo } = await context.client.get(urlTo.href);

  if (
    !cartFrom ||
    !cartTo ||
    !cartFrom.shipments ||
    cartFrom.shipments.length === 0 ||
    !cartFrom.shipments[0].lineItems ||
    cartFrom.shipments[0].lineItems.length === 0
  ) {
    return cartTo;
  }

  const lineItemsFrom = cartFrom.shipments[0].lineItems;
  const urlAddLineitems = new URL(
    `/api/carts/${scope}/${customerIdTo}/${cartName}/lineItems/batch`,
    api.url
  );
  await context.client.post(
    urlAddLineitems.href,
    {
      lineItems: lineItemsFrom
    }
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function login(context, params) {
  try {
    const { api, scope, myAccount } = context.config;
    const { password, username } = params;
    if (
      myAccount.secretPassphrase === undefined ||
      myAccount.secretPassphrase === ''
    ) {
      console.error(
        'Secret Passphrase is not configured. For security purpose it is important to configure Secret Passphrase.'
      );
      return { errorMessage: 'Secret passphrase is not configured.' };
    }

    const { id: customerIdFrom } = context.config.auth.getCustomerToken();

    const url = new URL(`/api/membership/${scope}/Login`, api.url);

    const { data } = await context.client.put(url.href, {
      password,
      username
    });

    if (data?.success) {
      const urlGetUser = new URL(
        `/api/customers/${scope}/byUsername/${username}`,
        api.url
      );
      const { data } = await context.client.get(urlGetUser.href);
      const tokenData = { id: data.id, isGuest: false };

      context.config.auth.setCustomerToken(tokenData);

      if (customerIdFrom && tokenData.id) {
        await mergeCarts(context, {
          customerIdFrom,
          customerIdTo: tokenData.id
        });
      }

      return tokenData;
    }
  } catch (ex) {
    console.log(ex);
  }
  return {};
}
