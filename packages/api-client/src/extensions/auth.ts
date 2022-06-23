import { ApiClientExtension } from "@vue-storefront/core";
import jwt from "jsonwebtoken";

const AUTH_COOKIE_NAME: string = "vsf-occ-user-token";

export const tokenExtension: ApiClientExtension = {
  name: "tokenExtension",
  hooks: (req, res) => ({
    beforeCreate: ({ configuration }) => {
      return {
        ...configuration,
        auth: {
          getCustomerToken: () => {
            const token = req.cookies[AUTH_COOKIE_NAME];
            const { myAccount } = configuration;

            if (token) {
              try {
                const decoded: string = jwt.verify(
                  token,
                  myAccount.secretPassphrase
                );
                console.log(`decoded: ${decoded}`);
                return decoded;
              } catch (e) {
                console.log("userToken parse error");
              }
            }
            return {};
          },
          setCustomerToken: (tokenData) => {
            console.log(`setCustomerToken`)
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

            const options = {
              expires:  new Date(cookieExpiration),
              httpOnly: true,
              secure: req.secure,
            };

            res.cookie(AUTH_COOKIE_NAME, token, options);
          },
        },
      };
    },
  }),
};
