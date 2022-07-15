import { Logger } from '@vue-storefront/core';

export default (context) => {
  const token = context.$cookies.get('vsf-occ-data');

  try {
    const { isGuest } = token;

    if (isGuest !== false) {
      context.app.router.push('/');
      context.redirect('/en-CA');
    }
  } catch (ex) {
    Logger.debug(ex);
  }
};
