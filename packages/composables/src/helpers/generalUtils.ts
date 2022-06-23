import {
  Context
} from '@vue-storefront/core';
export const isGuidEmpty = (guid: string): boolean => {
  return (!guid ||
    guid === '00000000-0000-0000-0000-000000000000' ||
    guid === '00000000000000000000000000000000');
};

export const getUserToken = (context: Context): string => {
  const app = context.$occ.config.app;
  const appKey = app.$config.appKey;
  return app.$cookies.get(appKey + '-data');
};

export const setUserToken = (context: Context, userToken: string, opts: any = {}): void => {
  const app = context.$occ.config.app;
  const appKey = app.$config.appKey;
  console.log(app);
  app.$cookies.set(appKey + '-data', userToken, opts);
};

