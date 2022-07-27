import { Logger } from '@vue-storefront/core';

export default (context) => {
  const token = context.$cookies.get('vsf-occ-data');

  console.log(`midlware-is-ath, ${token}`);

  try {
    if (!token || token.isGuest !== false) {
      context.app.router.push('/');
      context.redirect('/en-CA');
    }
  } catch (ex) {
    Logger.debug(ex);
  }
};
