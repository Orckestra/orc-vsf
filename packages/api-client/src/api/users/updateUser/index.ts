import { parseUserToken } from '../../../helpers/generalUtils';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updateUser(context, params) {
  const { cellNumber,
    customerType,
    email,
    faxExtension,
    faxNumber,
    firstname,
    language,
    lastname,
    passwordQuestion,
    phoneExtension,
    phoneExtensionWork,
    phoneNumber,
    phoneNumberWork,
    username,
    userToken } = params;
  const { api, scope, myAccount } = context.config;
  const { id: customerId } = parseUserToken(userToken, myAccount.secretPassphrase);
  if (!customerId) return null;

  const url = new URL(
    `/api/customers/${scope}/${customerId}`,
    api.url
  );

  const body = {
    cellNumber,
    customerType,
    email,
    faxExtension,
    faxNumber,
    firstname,
    language,
    lastname,
    passwordQuestion,
    phoneExtension,
    phoneExtensionWork,
    phoneNumber,
    phoneNumberWork,
    username
  };
  const { data } = await context.client.put(url.href, body, {
    validateStatus: function (status) {
      return status >= 200 && status < 500;
    }
  });
  return data;
}
