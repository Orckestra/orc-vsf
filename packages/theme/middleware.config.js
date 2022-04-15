module.exports = {
  integrations: {
    occ: {
      location: '@vue-storefront/orc-vsf-api/server',
      configuration: {
        api: {
          url: process.env.OVERTURE_URL,
          authToken: process.env.OVERTURE_AUTH_TOKEN,
        },
        scope: process.env.OVERTURE_SCOPE_NAME,
      },
    },
  },
};
