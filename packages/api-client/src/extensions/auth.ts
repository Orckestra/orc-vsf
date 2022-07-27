import { ApiClientExtension } from '@vue-storefront/core';
import jwt from 'jsonwebtoken';

const AUTH_COOKIE_NAME = 'vsf-occ-token';
const DATA_COOKIE_NAME = 'vsf-occ-data';

export const tokenExtension: ApiClientExtension = {
  name: 'tokenExtension',
  hooks: (req, res) => ({
    beforeCreate: ({ configuration }) => {
      return {
        ...configuration,
        auth: {
          getCustomerToken: () => {
            const token = req.cookies[AUTH_COOKIE_NAME];
            const data = req.cookies[DATA_COOKIE_NAME];
            const { myAccount } = configuration;
            try {
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
            // if the token is expired or broken, then we remove the data cookie, it should force to generate a guest token
            if (data) {
              res.cookie(DATA_COOKIE_NAME, '', {
                expires: new Date(0), // 1 January 1970 UTC.
              });
            }
            res.setHeader('Token-Expired', 'true');
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
              const cookieExpiration: any = Date.now() + (expireInSeconds * 1000);

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
              res.cookie(
                DATA_COOKIE_NAME,
                JSON.stringify(tokenData),
                publicDataOptions
              );

              // remove header Token-Expired if someone asked before
              res.removeHeader('Token-Expired');
            } catch (ex) {
              console.log(ex);
            }
          },
        },
      };
    },
  }),
};
