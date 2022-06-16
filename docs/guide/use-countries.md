# useCountries

## Features
`useCountries` composable is responsible for fetching a list of countries. A common usage scenario for this composable is adding or editing address.

## API
```typescript
export type CountryItem = {
  name: string,
  sortOrder: number,
  isoCode: string,
  regions: RegionItem[]
  isSupported: boolean,
  id: string,
  phoneRegex: string,
  postalCodeRegex: string
}

export type RegionItem = {
  name: string
  sortOrder: number,
  isoCode: string,
  isSupported: boolean,
  id: string,
}
```

### `load`
Function that gets the `countries` for configured Scope.

### `countries`
Returns an array of countries fetched by `load` method as a `CountryItem[]` property.

### `loading`
Returns the current state of `load` as `computed` `boolean` property

### `error`
Reactive object containing the error message, if load failed for any reason.

## Getters
````typescript
export interface CountriesGetters<COUNTRIES, REGIONS> {
  getRegions(countries: COUNTRIES, countryCode: string): REGIONS;
}
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useCountries, countriesGetters } from '@vue-storefront/orc-vsf';

export default {
  setup () {
    const { load: loadCountries, loading, countries } = useCountries();
    const getRegions = (country) => countriesGetters.getRegions(countries.value, country);

    onSSR(async () => {
      await loadCountries();
    });

    return {
      countries,
      loading,
      getRegions
    }
  }
}
```
