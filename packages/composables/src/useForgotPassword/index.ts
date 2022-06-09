import {
  Context,
  useForgotPasswordFactory,
  UseForgotPasswordFactoryParams
} from '@vue-storefront/core';
import { checkResponseForError } from '../helpers/responseUtils';

const factoryParams: UseForgotPasswordFactoryParams<any> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resetPassword: async (context: Context, { email, customQuery }) => {
    const response = await context.$occ.api.resetPassword({ email });
    checkResponseForError(response);
    return response;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNewPassword: async (context: Context, { tokenValue, newPassword, customQuery }) => {
    const customer = await context.$occ.api.getByTicket({ ticket: tokenValue });
    return await context.$occ.api.resetPassword({ password: newPassword, username: customer.username });
  }
};

export const useForgotPassword = useForgotPasswordFactory<any>(factoryParams);
