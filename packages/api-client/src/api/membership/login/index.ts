// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function login(context, params) {
  try {
    console.log(`login1`);
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

    // const { id: customerIdFrom } = context.config.auth.getCustomerToken();

    console.log(`login10`);

    const url = new URL(`/api/membership/${scope}/Login`, api.url);

    const { data } = await context.client.put(url.href, {
      password,
      username,
    });

    if (data?.success) {
      console.log('356');
      const urlGetUser = new URL(
        `/api/customers/${scope}/byUsername/${username}`,
        api.url
      );
      console.log(`login20`);
      const { data } = await context.client.get(urlGetUser.href);
      const tokenData = { id: data.id, isGuest: false };

      console.log(`context.config.auth.setCustomerToken`);
      context.config.auth.setCustomerToken(tokenData); 

      console.log(`login40`);

      // await mergeCarts(context, {
      //   customerIdFrom,
      //   customerIdto: tokenData.id
      // });

      console.log(`login80`);

      return tokenData;
    }
  } catch (ex1) {
    console.log(ex1);
  }
  return {};
}

const mergeCarts = async (context, params) => {
  const { api, scope } = context.config;
  const { customerIdFrom, customerIdTo, cartName = 'Default' } = params;

  console.log(`merge10, ${customerIdFrom}, ${customerIdTo},`);

  if (!customerIdFrom || !customerIdTo) return null;

  const urlFrom = new URL(
    `/api/carts/${scope}/${customerIdFrom}/${cartName}`,
    api.url
  );
  const urlTo = new URL(
    `/api/carts/${scope}/${customerIdTo}/${cartName}`,
    api.url
  );

  console.log(`merge20`);

  const { data: cartFrom } = await context.client.get(urlFrom.href);
  const { data: cartTo } = await context.client.get(urlTo.href);

  console.log(`merge30`);

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
  const { data: updatedCartTo } = await context.client.post(
    urlAddLineitems.href,
    {
      lineItems: lineItemsFrom,
    }
  );
};
