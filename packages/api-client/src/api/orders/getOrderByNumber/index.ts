// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getOrderByNumber(context, params) {

  console.log("getOrderByNumber");
    const { api, scope } = context.config;
    const { orderNumber } = params;
   console.log(orderNumber);
    const url = new URL(
      `/api/orders/${scope}/byNumber/${orderNumber}?IncludeLineItems=true&IncludeShipment=true&IncludePayment=true`,
      api.url
    );
  console.log(url.href);
    const { data } = await context.client.get(url.href);
    console.log("order by Number");
    console.log(data);
    return data;
  }