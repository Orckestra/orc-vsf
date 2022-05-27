import CryptoJS from 'crypto-js';
import { createGuid } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function initializeGuest(context) {
  const { myAccount } = context.config;
  const userToken = CryptoJS.AES.encrypt(`${createGuid()}`, myAccount.secretPassphrase).toString();

  return userToken;
}
