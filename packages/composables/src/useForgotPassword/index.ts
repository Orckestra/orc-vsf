import {
  Context,
  useForgotPasswordFactory,
  UseForgotPasswordFactoryParams
} from '@vue-storefront/core';

const factoryParams: UseForgotPasswordFactoryParams<any> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resetPassword: async (context: Context, { email, customQuery }) => {
    return await context.$occ.api.resetPassword({ email });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNewPassword: async (context: Context, { tokenValue, newPassword, customQuery }) => {
    const customer = await context.$occ.api.getByTicket({ ticket: tokenValue });
    return await context.$occ.api.resetPassword({ password: newPassword, username: customer.username });
  }
};

export const useForgotPassword = useForgotPasswordFactory<any>(factoryParams);
