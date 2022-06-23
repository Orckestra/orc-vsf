import { integrationPlugin } from '@vue-storefront/core';

const moduleOptions = <%= serialize(options) %>;

export default integrationPlugin(({ integration, app }) => {
  integration.configure('occ', {
    ...moduleOptions,
    app,
  
  });
});
