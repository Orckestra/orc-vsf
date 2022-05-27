import {
  Context,
  useUserFactory,
  UseUserFactoryParams
} from '@vue-storefront/core';
import { createGuid } from '../helpers/generalUtils';
import type { User } from '@vue-storefront/orc-vsf-api';
import type {
  UseUserUpdateParams as UpdateParams,
  UseUserRegisterParams as RegisterParams
} from '../types';

const params: UseUserFactoryParams<User, UpdateParams, RegisterParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const userToken = app.$cookies.get(appKey + '_token');

    if ((userToken === undefined || userToken === '')) {
      // Initiate Guest
      const guestUserToken = await context.$occ.api.initializeGuest();
      app.$cookies.set(appKey + '_token', guestUserToken);
      return;
    }

    if (userToken) {
      const user = await context.$occ.api.getUser({ userToken });
      if (user && user.id) return user;
      const resetUserToken = await context.$occ.api.initializeGuest();
      app.$cookies.set(appKey + '_token', resetUserToken);
      //app.$cookies.set(appKey + '_isAuthenticated', false);
    }

    return;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logOut: async (context: Context) => {
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const guestUserToken = await context.$occ.api.initializeGuest();
    app.$cookies.set(appKey + '_token', guestUserToken);
    return;
    //app.$cookies.set(appKey + '_isAuthenticated', false);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    console.log('Mocked: useUser.updateUser');
    return currentUser;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: async (context: Context, { email, password, firstName, lastName }) => {
    console.log('Mocked: useUser.register');
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logIn: async (context: Context, { username, password }) => {
    let login = await context.$occ.api.login({ username, password });
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    if (Boolean(login.success)) {
      const user = await context.$occ.api.getUser({ username });
      app.$cookies.set(appKey + '_token', user.userToken);
      return params.load(context);
    } else {
      throw new Error('Customer sign-in error');
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (context: Context, { currentUser, currentPassword, newPassword }) => {
    console.log('Mocked: useUser.changePassword');
    return null;
  }
};

export const useUser = useUserFactory<User, UpdateParams, RegisterParams>(params);
