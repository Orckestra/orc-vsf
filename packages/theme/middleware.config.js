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
          availableFacets: ['Brand','SeasonWear','ShirtType','ShoeType','HeelsHeight'],
          categoryCountFacets: ['CategoryLevel1', 'CategoryLevel2', 'CategoryLevel3']
        },
        cdnDamProviderConfig: {
          serverUrl: 'https://refapp.azureedge.net',
          imageFolderName: 'images',
          fallbackImage: 'image_not_found.jpg'
        }
      },
    },
  },
};
