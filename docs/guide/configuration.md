# Configuration
The integration is configured via `middleware.config.js` file.

```
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
          availableFacets: [
            { name: 'Brand', type: 1 },
            { name: 'SeasonWear', type: 1 },
            { name: 'ShirtType', type: 1 },
            { name: 'ShoeType', type: 1 },
            { name: 'HeelsHeight', type: 1 },
            { name: 'CurrentPrice', type: 2 }],
          categoryCountFacets: ['CategoryLevel1', 'CategoryLevel2', 'CategoryLevel3']
        },
        cdnDamProviderConfig: {
          serverUrl: 'https://refapp.azureedge.net',
          imageFolderName: 'images',
          maxThumbnailImages: 1
        }
      },
    },
  },
};

```