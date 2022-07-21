import { Logger } from '@vue-storefront/core';

export default (context) => {
  const token = context.$cookies.get('vsf-occ-data');

  try {
    if (!token || token.isGuest !== false) {
      context.app.router.push('/');
      context.redirect('/en-CA');
    }
  } catch (ex) {
    Logger.debug(ex);
  }
};
