import { Context } from '@vue-storefront/core';
import { useCountriesFactory } from '../factories/useCountriesFactory';
import type { CountryItem } from '@vue-storefront/orc-vsf-api';

export const useCountries = useCountriesFactory<CountryItem[]>({
  load: (context: Context) => {
    const app: any = context.$occ.config.app;
    const locale: any = app.i18n.locale;
    return context.$occ.api.getCountries({ locale, IncludeRegions: true });
  }
});
