import CryptoJS from 'crypto-js';
import { createGuid } from '../../../helpers/generalUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function initializeGuestToken(context) {
  const { myAccount } = context.config;
  const token = JSON.stringify({ id: createGuid(), isGuest: true });
  const userToken = CryptoJS.AES.encrypt(token, myAccount.secretPassphrase).toString();

  return userToken;
}
