/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function registerUser(
  context,
  params
) {
  const { email, firstName, lastName, password } = params;
  const { api, scope } = context.config;
console.log(params);
console.log("registerUser");
  const url = new URL(
    `/membership/${scope}`,
    api.url
  );
  const { data } = await context.client.post(url.href,{    
        email,
        firstName,
        lastName,
        password      
  });

  return {
    ...data
  };
}
