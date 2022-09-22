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
        paymentProviders: ['Onsite payment'],
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
        mediaProviderConfig: {
          serverUrl: 'https://refapp.azureedge.net',
          imageFolderName: 'images',
          maxThumbnailImages: 1
        },
        myAccount: {
          secretPassphrase: process.env.SECRET_PASSPHRASE
        }
      },
    },
  },
};

```

# Configure environment variables
After installation, the first step is configuring the integration using the environment variables.
 
Go to the root folder of your theme project.
 
Make a copy of the `.env.example` file and rename it to `.env`.

Update values in the .env file.