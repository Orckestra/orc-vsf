# useSearch

## Features
`useSearch` composable is responsible for fetching a data of products by search term. 

## API
```typescript
interface UseFacet<any> {
  result: ComputedProperty<SearchResults>;
  loading: ComputedProperty<boolean>;
  search: (params?: ProductsSearchParams) => Promise<void>;
  error: ComputedProperty<UseSearchErrors>;
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
interface SearchGetters<SearchResults, any> {
  getItems(result: SearchResults): any;
  getCategoryTree(result: SearchResults): AgnosticCategoryTree;
  getPagination(result: SearchResults): AgnosticPagination;
  getItemPrice(item: any): AgnosticPrice;
  getSortOptions(result: SearchResults): AgnosticSort;
  getBreadcrumbs(result: SearchResults): AgnosticBreadcrumb[];
  getItemImages(item: any): AgnosticMediaGalleryItem[];
  getFilters(result: SearchResults): AgnosticFilter[];
  getItemName(item: any): string;
  getItemId(item: any): string;
  getItemSlug(item: any): string;
}
````
## Example

```javascript
import { watch } from 'vue'
import { onSSR } from '@vue-storefront/core';
import { useSearch, searchGetters } from '@vue-storefront/orc-vsf';

export default {
  setup () {
    const { result, search, loading, error } = useSearch();
    const searchQuery = ref("");
    // Take note of this line the result should be pass through 
    // searchGetters.getItems() to extract only array of Product
    const productsFound = computed(() => searchGetters.getItems(result.value));

    watch(searchQuery, () => {
      if (searchQuery.length > 1) {
        search({ term: searchQuery.value });
      }
    })

    onSSR(async () => {
      await search({ term: "" });
    });

    return {
      productsFound,
      searchQuery
    }
  }
}
```