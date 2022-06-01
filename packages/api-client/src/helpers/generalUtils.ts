import CryptoJS from 'crypto-js';

export const isGuidEmpty = (guid: string): boolean => {
  return (!guid ||
    guid === '00000000-0000-0000-0000-000000000000' ||
    guid === '00000000000000000000000000000000');
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const parseUserToken = (token: string, passPhrase: string): any => {
  if (token) {
    try {
      const bytes = CryptoJS.AES.decrypt(token, passPhrase);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      console.log('userToken parse error');
    }
  }
  return {};
};
