import { integrationPlugin } from '@vue-storefront/core';

const moduleOptions = <%= serialize(options) %>;

export default integrationPlugin(({ integration, app }) => {
  //const TOKEN_KEY = 'vsf-occ-token';
  const onTokenChange = (newToken) => {
    // try {
    //   const currentToken = app.$cookies.get(TOKEN_KEY);

    //   if (!currentToken || currentToken.access_token !== newToken.access_token) {
    //     app.$cookies.set(TOKEN_KEY, newToken);
    //   }
    // } catch (e) {
    //   // Cookies on is set after request has sent.
    // }
  };

  const onTokenRemove = () => {
    //app.$cookies.remove(TOKEN_KEY);
  };

  const onTokenRead = () => {
    //return app.$cookies.get(TOKEN_KEY);
  };

  integration.configure('occ', {
    ...moduleOptions,
    app,
    // additionalProperties: {
    //   auth: {
    //     onTokenChange,
    //     onTokenRead,
    //     onTokenRemove
    //   }
    // }
  });
});
