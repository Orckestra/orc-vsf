import { Logger } from '@vue-storefront/core';

export default (context) => {
  const appKey = context.$config.appKey;
  const token = context.$cookies.get(appKey + '-data');

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
