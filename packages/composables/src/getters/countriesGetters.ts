import type {
  CountryItem, RegionItem
} from 'orc-vsf-api';
import { CountriesGetters } from '../types';

function getCountry(countries: CountryItem[], isoCode: string): CountryItem {
  return countries?.find(c => c.isoCode === isoCode);
}

function getCountryName(countries: CountryItem[], isoCode: string): string {
  const country = getCountry(countries, isoCode);
  return country?.name ?? isoCode;
}

function getCountryRegion(countries: CountryItem[], countryIsoCode: string, regionIsoCode: string): RegionItem {
  const country = getCountry(countries, countryIsoCode);
  return country?.regions.find(r => r.isoCode === regionIsoCode);
}

function getCountryRegionName(countries: CountryItem[], countryIsoCode: string, regionIsoCode: string): string {
  const region = getCountryRegion(countries, countryIsoCode, regionIsoCode);
  return region?.name ?? regionIsoCode;
}

function getRegions(countries: CountryItem[], country: string): RegionItem[] {
  return countries?.find(c => c.isoCode === country)?.regions || [];
}

export const countriesGetters: CountriesGetters<CountryItem, RegionItem> = {
  getRegions,
  getCountry,
  getCountryName,
  getCountryRegion,
  getCountryRegionName
};
