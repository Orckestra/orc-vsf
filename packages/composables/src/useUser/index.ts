import {
  Context,
  useUserFactory,
  UseUserFactoryParams
} from '@vue-storefront/core';
import type { User } from '@vue-storefront/orc-vsf-api';
import type {
  UserUpdateParams as UpdateParams,
  UserRegisterParams as RegisterParams
} from '../types';
import { checkResponseForError } from '../helpers/responseUtils';
import { getUserToken } from '../helpers/generalUtils';

const params: UseUserFactoryParams<User, UpdateParams, RegisterParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }

    if (userToken) {
      const user = await context.$occ.api.getUser();
      return user;
    }

  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logOut: async (context: Context) => {
    await context.$occ.api.initializeGuestToken();
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    if (!updatedUserData) return;
    const app = context.$occ.config.app;
    const userToken = getUserToken(context);
    if ((userToken === undefined || userToken === '')) {
      return null;
    }
    const language: any = app.i18n.locale;

    const response = await context.$occ.api.updateUser({ ...updatedUserData, language, userToken });
    checkResponseForError(response);
    return response;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: async (context: Context, { email, password, firstName, lastName }) => {
    const app: any = context.$occ.config.app;
    const language: any = app.i18n.locale;
    await context.$occ.api.registerUser({ email, password, firstName, lastName, language });
    return params.logIn(context, { username: email, password });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logIn: async (context: Context, { username, password }) => {
    const userToken = await context.$occ.api.login({ username, password });
    if (userToken?.id) {
      return params.load(context);
    } else {
      throw new Error('Customer sign-in error');
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (context: Context, { currentPassword, newPassword }) => {
    const response = await context.$occ.api.changePassword({ currentPassword, newPassword });
    checkResponseForError(response);
    return params.load(context);
  }
};

export const useUser = useUserFactory<User, UpdateParams, RegisterParams>(params);
