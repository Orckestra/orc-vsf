# useProduct

## Features
`useProduct` composable is responsible for fetching a list of products or product details based on `queryType` parameter. A common usage scenario for this composable is products sets and product details.

## API
```typescript
export interface Product {
  productId: string
  name: string;
  description?: any,
  sku: string,
  currentPrice?: any,
  regularPrice?: any,
  propertyBag: any,
  parentCategoryIds: any,
  prices?: any
}
```

### `search`
Function that gets the `products` or `product` based on passed `queryType` parameter. 

### `products`
Returns an array of products `Product[]` or a single product `Product` fetched by `search` method.

### `loading`
Returns the current state of `search` as `computed` `boolean` property

### `error`
Reactive object containing the error message, if search failed for any reason.

## Getters
````typescript
interface ProductGetters<Product> {
  getPrice: (product: Product) => AgnosticPrice;
  getName: (product: Product) => string;
  getDescription: (product: Product) => string; 
}

export interface AgnosticPrice {
    regular: number | null;
    special?: number | null;
}
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useProduct, productGetters } from '@vue-storefront/orc-vsf';

export default {
  setup () {
    const id = computed(() => route.value.params.id);
    const { products: product, search: searchProduct, loading } = useProduct(`product-${id}`);
  
    onSSR(async () => {
        await searchProduct({ queryType: 'DETAIL', id: id.value });
    });

    return {
      product,
      loading
    }
  }
}
```