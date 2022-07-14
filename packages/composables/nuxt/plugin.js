import { integrationPlugin } from '@vue-storefront/core';

const moduleOptions = <%= serialize(options) %>;

export default integrationPlugin(({ integration, app }) => {
  integration.configure('occ', {
    ...moduleOptions,
    app,
  });

  const isSSR = process.server;
  if(isSSR) {
    transferApiCookie(app['$vsf']['$occ'].client, app.context.res)
  }
}
);

// transfer set-cookie header from api to client on SSR
const transferApiCookie = (apiClient, res) => {
  apiClient.interceptors.response.use(response => {
    if(response.headers) {
      const setCookie = response.headers["set-cookie"];
      if(setCookie) {
        res.setHeader('Set-cookie', setCookie);
      }
    }
    return response;
  });
}
