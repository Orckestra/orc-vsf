
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function getCountries(context, params) {
  const { api } = context.config;
  const { locale, IncludeRegions = false } = params;
  const url = new URL(
    `api/countries?CultureName=${locale}&IncludeRegions=${IncludeRegions}`,
    api.url
  );

  const { data } = await context.client.get(url.href);

  return data?.map(c => ({ ...c, name: c.name[locale], regions: c.regions?.map(r => ({ ...r, name: r.name[locale] })) })) || [];
}
