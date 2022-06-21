import type {
  CountryItem, RegionItem
} from '@vue-storefront/orc-vsf-api';
import { CountriesGetters } from '../types';

function getRegions(countries: CountryItem[], country: string): RegionItem[] {
  return countries?.find(c => c.isoCode === country)?.regions || [];
}

export const countriesGetters: CountriesGetters<CountryItem[], RegionItem[]> = {
  getRegions
};
