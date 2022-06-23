import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function initializeGuestToken(context) {
  try {
    const { myAccount } = context.config;
    const uuid = uuidv4();
    const tokenData = { id: uuid, isGuest: true };
    // if (myAccount.secretPassphrase === undefined || myAccount.secretPassphrase === '') {
    //   console.error('Secret Passphrase enviroment variable is not configured. For security purpose it is important to configure secret passphrase.');
    // }
    //const userToken = CryptoJS.AES.encrypt(token, myAccount.secretPassphrase).toString();

    const token2 = jwt.sign(tokenData, myAccount.secretPassphrase, {
      expiresIn: '48h',
    }); // TODO: expire

    console.log("123");
    //const appKey = context.config.appKey;
    ///context.res.cookie(appKey + '_token', token2, { maxAge: 1000 * 60 * 60 * 48 });


    context.config.auth.setCustomerToken(tokenData);

    return tokenData;
  } catch (ex1) {
    console.log(ex1);
  }
}
