import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function initializeGuestToken(context) {
  try {
    const uuid = uuidv4();
    const tokenData = { id: uuid, isGuest: true };

    context.config.auth.setCustomerToken(tokenData);

    return tokenData;
  } catch (ex) {
    console.log(ex);
  }
}
