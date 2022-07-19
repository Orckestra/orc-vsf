import { Context } from '@vue-storefront/core';
export const isGuidEmpty = (guid: string): boolean => {
  return (
    !guid ||
    guid === '00000000-0000-0000-0000-000000000000' ||
    guid === '00000000000000000000000000000000'
  );
};

export const getUserToken = (context: Context): any => {
  try {
    const app = context.$occ.config.app;
    return app.$cookies.get('vsf-occ-data');
  } catch {
    // ignore
  }
  return { isGuest: true };
};
