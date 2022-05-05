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
        inventoryLocationIds: process.env.OVERTURE_INVENTORY_LOCATION_IDS,
        searchConfig: {
          defaultItemsPerPage: 12,
          availableFacets: ['CategoryLevel1_Facet','CategoryLevel2_Facet','Brand'],
          categoryCountFacets: ['CategoryLevel1', 'CategoryLevel2', 'CategoryLevel3']
        }
      },
    },
  },
};
