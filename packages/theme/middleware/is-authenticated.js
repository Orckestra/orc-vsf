import { Logger } from '@vue-storefront/core';

export default (context) => {
  const appKey = context.$config.appKey;
  const token = context.$cookies.get(appKey + '_token');
  // check if user not logged In
  if (!token) {
    context.app.router.push('/');
    context.redirect('/en-CA');
  }
};
