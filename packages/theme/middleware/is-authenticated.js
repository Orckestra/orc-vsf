import { Logger } from '@vue-storefront/core';

export default (context) => {
  const appKey = context.$config.appKey;
  const token = context.$cookies.get(appKey + '_token');
  const isAuthenticated = context.$cookies.get(appKey + '_isAuthenticated');
  // check if user not logged In
  if (!token) {
    context.app.router.push('/');
    context.redirect('/en-CA');
  }
  // Logger.error('Please implement vendor-specific is-authenticated.js middleware in the \'middleware\' directory to block guests from accessing user profile routes');
};
