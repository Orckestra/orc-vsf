import {
  Context,
  useUserFactory,
  UseUserFactoryParams
} from '@vue-storefront/core';
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
      const guestUserToken = await context.$occ.api.initializeGuestToken();
      app.$cookies.set(appKey + '_token', guestUserToken);
      return;
    }

    if (userToken) {
      const user = await context.$occ.api.getUser({ userToken });
      return user;
    }

  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logOut: async (context: Context) => {
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    const guestUserToken = await context.$occ.api.initializeGuestToken();
    app.$cookies.set(appKey + '_token', guestUserToken);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    console.log('Mocked: useUser.updateUser');
    return currentUser;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: async (context: Context, { email, password, firstName, lastName }) => {
    const app: any = context.$occ.config.app;
    const language: any = app.i18n.locale;
    await context.$occ.api.registerUser({ email, password, firstName, lastName, language });
    return params.logIn(context, {username: email, password});
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logIn: async (context: Context, { username, password }) => {
    const login = await context.$occ.api.login({ username, password });
    const app = context.$occ.config.app;
    const appKey = app.$config.appKey;
    if (login.success) {
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
