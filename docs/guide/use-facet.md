# useFacet

## Features
`useFacet` composable is responsible for fetching a data of products with facets. A common usage scenario for this composable is category pages.

## API
```typescript
interface UseFacet<any> {
  result: ComputedProperty<FacetSearchResult<SearchResults>>;
  loading: ComputedProperty<boolean>;
  search: (params?: AgnosticFacetSearchParams) => Promise<void>;
  error: ComputedProperty<UseFacetErrors>;
}

export interface SearchResults {
    total: any,
    products: any,
    facets: Facet[],
    categories?: Category[],
    categoryCounts: any
}

export declare type Facet = {
    facetType: any;
    title: string;
    fieldName: string;
    values: FacetValue[];
    gapSize?: string;
    startValue?: string;
    endValue?: string;
};

export declare type FacetValue = {
    minimumValue?: any;
    maximumValue?: any;
    value: string;
    displayName: string;
    count: number;
};

export interface Category {
  id: string
  name: string;
  primaryParentCategoryId: string;
  definitionName: string;
  sequenceNumber: number;
}
```

### `search`
Function that loading the data based on passed parameters. 

### `result`
Reactive data object containing the response from the backend.

### `loading`
Reactive object containing information about the loading state of search.

### `error`
Reactive object containing the error message, if search failed for any reason.

## Getters
````typescript
interface FacetsGetters<Facet> {
  getGrouped: (data: FacetSearchResult<SearchResults>, criteria?: string[]) => (AgnosticGroupedFacet & {type: string});
  getCategoryTree: (data: FacetSearchResult<SearchResults>, root?: string = 'Root', level = 3) => AgnosticCategoryTree;
  getSortOptions: (data: FacetSearchResult<SearchResults>) => AgnosticSort;
  getProducts: (data: FacetSearchResult<SearchResults>) => RESULTS;
  getPagination: (data: FacetSearchResult<SearchResults>) => AgnosticPagination;
  getBreadcrumbs: (data: FacetSearchResult<SearchResults>) => AgnosticBreadcrumb[];
}
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useFacet, facetGetters } from '@vue-storefront/orc-vsf';

export default {
  setup () {
    const { result, search, loading, error } = useFacet();
    const products = computed(() => facetGetters.getProducts(result.value));
    const categoryTree = computed(() => facetGetters.getCategoryTree(result.value));
    const breadcrumbs = computed(() => facetGetters.getBreadcrumbs(result.value));
    const pagination = computed(() => facetGetters.getPagination(result.value));
    const facets = computed(() => facetGetters.getGrouped(result.value, ['Brand','SeasonWear']));

    onSSR(async () => {
       await search({...th.getFacetsFromURL(), withCategoryCounts: true});
    });

    return {
      products,
      categoryTree,
      breadcrumbs,
      pagination,
      facets,
      loading
    }
  }
}
```