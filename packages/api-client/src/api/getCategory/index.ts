// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getCategory(context, params) {

  const { api, scope } = context.config;
  const { locale } = params;
  const url = new URL(
    `/api/categories/v2/${scope}?CultureName=${locale}`,
    api.url
  );

  const { data } = await context.client.get(url.href);

  return data ? data.categories.map(c => ({ name: c.displayName[locale], ...c })) : [];
}
