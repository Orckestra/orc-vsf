import { ApiClientExtension } from '@vue-storefront/core';
import jwt from 'jsonwebtoken';

const AUTH_COOKIE_NAME: string = 'vsf-occ-token';
const DATA_COOKIE_NAME: string = 'vsf-occ-data';

export const tokenExtension: ApiClientExtension = {
  name: 'tokenExtension',
  hooks: (req, res) => ({
    beforeCreate: ({ configuration }) => {
      return {
        ...configuration,
        auth: {
          getCustomerToken: () => {
            try {
              const token = req.cookies[AUTH_COOKIE_NAME];
              const { myAccount } = configuration;

              if (token) {
                try {
                  const decoded: string = jwt.verify(
                    token,
                    myAccount.secretPassphrase
                  );
                  return decoded;
                } catch (e) {
                  console.log('userToken parse error');
                }
              }
            } catch (ex) {
              console.log(ex);
            }
            return {};
          },
          setCustomerToken: (tokenData) => {
            try {
              if (!tokenData) {
                delete req.cookies[AUTH_COOKIE_NAME];
                return;
              }
              const { myAccount } = configuration;
              // 1 week
              const expireInSeconds: number = 60 * 60 * 24 * 7;
              const cookieExpiration: any = Date.now() + expireInSeconds * 1000;

              const token: string = jwt.sign(
                tokenData,
                myAccount.secretPassphrase,
                {
                  expiresIn: expireInSeconds,
                }
              );

              const authOptions = {
                expires: new Date(cookieExpiration),
                httpOnly: true,
                secure: req.secure,
              };
              const publicDataOptions = {
                expires: new Date(cookieExpiration),
              };

              // the JWT token is HTTP only to protect from XSS
              // reminder: data in JWT token can be decoded without a secure key, but can be verified only via a secure key.
              res.cookie(AUTH_COOKIE_NAME, token, authOptions);
              // customerId and IsGuest property is public
              res.cookie(DATA_COOKIE_NAME, tokenData, publicDataOptions);


              const cookies = require('cookie-universal')(req, res)
              cookies.set('cookie-name', 'cookie-value')

              console.log(`res.cookie(AUTH_COOKIE_NAME, token, authOptions)`);
              console.log(`res.cookie(DATA_COOKIE_NAME, tokenData, publicDataOptions);`);
            } catch (ex) {
              console.log(ex);
            }
          },
        },
      };
    },
  }),
};
