import { Logger } from '@vue-storefront/core';

export default (context) => {
  // const app = context.$occ.config.app;
  // const appKey = app.$config.appKey;

  // const token = context.$cookies.get(appKey + '-data'); // TODO: when cookie will secure

  try{
  const {isGuest } = getUserToken(context);
  // check if user not logged In
  if (isGuest === false) {
    context.app.router.push('/');
    context.redirect('/en-CA');
  }
} catch (ex){
  console.log(ex);
}
};
