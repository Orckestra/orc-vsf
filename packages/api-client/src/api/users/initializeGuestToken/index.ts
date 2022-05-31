import CryptoJS from 'crypto-js';
import {v4 as uuidv4} from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function initializeGuestToken(context) {
  const { myAccount } = context.config;
  const uuid = uuidv4();
  const token = JSON.stringify({ id: uuid, isGuest: true });

  const userToken = CryptoJS.AES.encrypt(token, myAccount.secretPassphrase).toString();

  return userToken;
}
