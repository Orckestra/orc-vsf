import {
  Context,
  useCategoryFactory,
  UseCategoryFactoryParams
} from '@vue-storefront/core';
import type { Category } from '@vue-storefront/orc-vsf-api';
import type {
  UseCategorySearchParams as SearchParams
} from '../types';

const params: UseCategoryFactoryParams<Category[], SearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categorySearch: async (context: Context, { customQuery, ...params }) => {
    const app: any = context.$occ.config.app;
    const locale: any = app.i18n.locale;
    return await context.$occ.api.getCategory({ ...params, locale }, customQuery);
  }
};

export const useCategory = useCategoryFactory<Category[], SearchParams>(params);
