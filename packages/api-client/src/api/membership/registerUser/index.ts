/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function registerUser(context, params) {
  const { email, firstName, lastName, password, username, passwordAnswer, passwordQuestion, language } = params;
  const { api, scope } = context.config;
  const url = new URL(`/api/membership/${scope}`, api.url);
  const { data } = await context.client.post(url.href, {
    email,
    firstName,
    lastName,
    password,
    username,
    passwordAnswer,
    passwordQuestion,
    language
  });
  return data;
}
