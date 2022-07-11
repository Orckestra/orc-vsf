
import { getCurrentInstance } from '@nuxtjs/composition-api';
import { AgnosticCategoryTree } from '@vue-storefront/core';
import { useRouter } from '@nuxtjs/composition-api';

const getContext = () => {
  const vm = getCurrentInstance();
  return vm.root.proxy;
};

const nonFilters = ['page', 'sort', 'term', 'itemsPerPage'];

const reduceFilters = (query) => (prev, curr) => {
  const makeArray = Array.isArray(query[curr]) || nonFilters.includes(curr);

  return {
    ...prev,
    [curr]: makeArray ? query[curr] : [query[curr]]
  };
};

const getFiltersDataFromUrl = (context, onlyFilters, restorePage = false) => {
  const { query } = context.$router.history.current;

  return Object.keys(query)
    .filter(f => (onlyFilters ? !nonFilters.includes(f) : nonFilters.includes(f)) && (restorePage ? f !== 'page' : true))
    .reduce(reduceFilters(query), {});
};

// eslint-disable-next-line
const useUiHelpers = () => {
  const router = useRouter();
  const context = getContext();

  const getFacetsFromURL = () => {
    const { query, params } = context.$router.currentRoute;
    const categorySlug = Object.keys(params).reduce((prev, curr) => params[curr] || prev, params.slug_1);

    return {
      categorySlug,
      page: parseInt(query.page as string, 10) || 1,
      sort: query.sort || 'score-desc',
      term: query.term,
      filters: getFiltersDataFromUrl(context, true),
      itemsPerPage: parseInt(query.itemsPerPage as string, 10) || 12
    } as any;
  };

  const getCatLink = (category: AgnosticCategoryTree): string => `/c/${category.slug}`;

  // eslint-disable-next-line
  const changeSorting = (sort) => {
    context.$router.push({
      query: {
        ...getFiltersDataFromUrl(context, true),
        sort
      }
    });
    return sort;
  };

  // eslint-disable-next-line
  const changeFilters = (filters) => {
    router.push({
      query: {
        ...getFiltersDataFromUrl(context, false, true),
        ...filters
      }
    });
  };

  // eslint-disable-next-line
  const changeItemsPerPage = (itemsPerPage) => {
    context.$router.push({
      query: {
        ...getFiltersDataFromUrl(context, false),
        itemsPerPage
      }
    });
  };

  // eslint-disable-next-line
  const setTermForUrl = (term: string) => {
    console.warn('[VSF] please implement useUiHelpers.changeSearchTerm.');
  };

  // eslint-disable-next-line
  const isFacetColor = (facet): boolean => {
    console.warn('[VSF] please implement useUiHelpers.isFacetColor.');

    return false;
  };

  const isFacetRange = (facet): boolean => {
    const type = facet.type;
    return type === 'Range' || type === '2';
  };

  // eslint-disable-next-line
  const isFacetCheckbox = (facet): boolean => {
    console.warn('[VSF] please implement useUiHelpers.isFacetCheckbox.');

    return false;
  };

  const getSearchTermFromUrl = () => {
    console.warn('[VSF] please implement useUiHelpers.getSearchTermFromUrl.');
  };

  const getTranslation = (translations: object, fallbackValue: string = ''): string => {
    const { locale } = router.app.$i18n;
    if (!translations) return fallbackValue;
    let translation = translations[locale];
    if (!translation) {
      const translationKeys = Object.keys(translations);
      const language = locale.substring(0, locale.indexOf("-"));
      for (let key of translationKeys) {
        if (key !== locale && key.startsWith(language)) {
          translation = translations[key];
          if (translation) {
            break;
          }
        }
      }
    }
    return translation ?? fallbackValue;
  }

  return {
    getFacetsFromURL,
    getCatLink,
    changeSorting,
    changeFilters,
    changeItemsPerPage,
    setTermForUrl,
    isFacetColor,
    isFacetRange,
    isFacetCheckbox,
    getSearchTermFromUrl,
    getTranslation
  };
};

export default useUiHelpers;
