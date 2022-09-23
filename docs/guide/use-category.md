# useCategory

## Features
`useCategory` composable is responsible for fetching a list of categories. A common usage scenario for this composable is navigation.

## API
```typescript
export interface Category {
  id: string
  name: string;
  primaryParentCategoryId: string;
  definitionName: string;
  sequenceNumber: number;
}
```

### `search`
Function that gets the `categories` for configured Scope.

### `categories`
Returns an array of categories fetched by `search` method as a `Category[]` property.

### `loading`
Returns the current state of `search` as `computed` `boolean` property

### `error`
Reactive object containing the error message, if search failed for any reason.

## Getters
````typescript
interface CategoryGetters<Category> {
  getTree: (categories: Category[]) => AgnosticCategoryTree | null;
  getBreadcrumbs: (categories: Category[], currentCategory?: string) => AgnosticBreadcrumb[];
  getCategoryTree?: (
    categories: Category[],
    currentCategory: string,
    level: number
  ) => AgnosticCategoryTree | null;
}

export interface AgnosticBreadcrumb {
  text: string;
  link: string;
}

export interface AgnosticCategoryTree {
  label: string;
  slug?: string;
  items: AgnosticCategoryTree[];
  isCurrent: boolean;
  count?: number;
  [x: string]: unknown;
}
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useCategory, categoryGetters } from 'orc-vsf';

export default {
  setup () {
    const { categories, search, loading } = useCategory('menuCategories');
    const menus = computed(() => categoryGetters.getCategoryTree(categories.value, '', 1)?.items);
    const breadcrumbs = computed(() => categoryGetters.getBreadcrumbs(categories.value, product.category));

    onSSR(async () => {
      await search({});
    });

    return {
      menus,
      breadcrumbs,
      loading
    }
  }
}
```