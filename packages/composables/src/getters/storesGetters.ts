import { Store } from '@vue-storefront/orc-vsf-api';
import { UseStoresGetters } from '../types';
import type { SearchQueryResult as StoresSearchResults } from '@vue-storefront/orc-vsf-api';

function getStores(searchResults: StoresSearchResults): Store {
  return searchResults?.results;
}

function getStoresForPickUp(searchResults: StoresSearchResults): Store {
  return searchResults?.results.filter(el => el.fulfillmentLocation.supportPickUp)
}

export const storesGetters: UseStoresGetters<Store> = {
  getStores,
  getStoresForPickUp
};
