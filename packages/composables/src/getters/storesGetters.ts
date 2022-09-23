import { Store } from 'orc-vsf-api';
import { UseStoresGetters } from '../types';
import type { StoreQueryResult } from 'orc-vsf-api';

function getStores(searchResults: StoreQueryResult): Store[] {
  return searchResults?.results;
}

function getStoresForPickUp(searchResults: StoreQueryResult): Store[] {
  return searchResults?.results.filter(el => el.fulfillmentLocation.supportPickUp);
}

export const storesGetters: UseStoresGetters<Store> = {
  getStores,
  getStoresForPickUp
};
