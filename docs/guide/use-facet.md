# useFacet

## Features
`useFacet` composable is responsible for fetching a data of products with facets. A common usage scenario for this composable is category pages.

## API
```typescript
interface UseFacet<any> {
  result: ComputedProperty<FacetSearchResult<Facet>>;
  loading: ComputedProperty<boolean>;
  search: (params?: AgnosticFacetSearchParams) => Promise<void>;
  error: ComputedProperty<UseFacetErrors>;
}

export interface Facet {
    total: any,
    products: any,
    facets: any,
    categories?: Category[],
    categoryCounts: any
}

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
  getAll: (data: FacetSearchResult<Facet>, criteria?: CRITERIA) => AgnosticFacet[];
  getGrouped: (data: FacetSearchResult<Facet>, criteria?: CRITERIA) => AgnosticGroupedFacet[];
  getCategoryTree: (data: FacetSearchResult<Facet>, root?: string = 'Root', level = 3) => AgnosticCategoryTree;
  getSortOptions: (data: FacetSearchResult<Facet>) => AgnosticSort;
  getProducts: (data: FacetSearchResult<Facet>) => RESULTS;
  getPagination: (data: FacetSearchResult<Facet>) => AgnosticPagination;
  getBreadcrumbs: (data: FacetSearchResult<Facet>) => AgnosticBreadcrumb[];
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

    onSSR(async () => {
       await search({...th.getFacetsFromURL(), withCategoryCounts: true});
    });

    return {
      products,
      categoryTree,
      breadcrumbs,
      pagination,
      loading
    }
  }
}
```