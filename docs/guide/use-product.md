# useProduct

## Features
`useProduct` composable is responsible for fetching a list of products or product details based on `queryType` parameter. A common usage scenario for this composable is product details or small product lists like related products, query or set highlights.

## API
```typescript

export interface UseProduct<PRODUCTS, ProductsSearchParams> {
    products: ComputedProperty<PRODUCTS>;
    loading: ComputedProperty<boolean>;
    error: ComputedProperty<UseProductErrors>;
    search(params: ProductsSearchParams & {
      queryType: ProductsQueryType;
    }): Promise<void>;
    [x: string]: any;
}

export declare enum ProductsQueryType {
    Detail = "List";
    Category = "Category";
    Related = "Related";
    Merchandising = "Merchandising";
    ProductSet = "ProductSet";
}

export declare type Product = {
    id?: string;
    productId?: string;
    name: any;
    displayName?: any;
    description?: any;
    sku: string;
    currentPrice?: any;
    regularPrice?: any;
    propertyBag: any;
    parentCategoryIds: any;
    prices?: ProductPrice;
    coverImage?: any;
    definitionName: string;
    variants?: ProductVariant[];
    currentVariantId: string;
    mediaSet?: ProductMedia[];
    variantMediaSet?: VariantMediaSet;
    media?: any;
    variantsMedia?: any;
};

export declare type ProductVariant = {
    active?: boolean;
    id: string;
    sku: string;
    displayName: any;
    propertyBag: any;
};

export declare type KeyVariantAttributeItemValue = {
    title: string;
    value: string;
    selected: boolean;
    disabled: boolean;
    relatedVariantIds?: any;
};
export declare type KeyVariantAttributeItem = {
    values: KeyVariantAttributeItemValue[];
    title: string;
    propertyName?: string;
    propertyDataType?: string;
};

export declare type ResizedMediaLink = {
    url: string;
    size: string;
    propertyBag?: any;
};

export declare type ProductMedia = {
    id: string;
    url: string;
    propertyBag?: any;
    mediaType: string;
    position?: number;
    tag?: string;
    title?: string;
    isCover: boolean;
    description?: any;
    isInherited?: boolean;
    isRemoved?: boolean;
    resizedInstances?: ResizedMediaLink[];
};

export declare type VariantMediaSet = {
    attributesToMatch: any;
    media?: ProductMedia[];
};

export declare type ProductPriceEntry = {
    isInherited: boolean;
    price: number;
    priceListCategory: string;
    priceListId: string;
    priceListType: string;
    sequenceNumber: number;
    startDate: any;
    endDate: any;
};

export declare type VariantPrice = {
    variantId: string;
    defaultPrice: number;
    inheritedFromProduct: boolean;
    pricing?: ProductPriceEntry;
    regularPricing?: ProductPriceEntry;
};

export declare type ProductPrice = {
    productId: string;
    defaultPrice?: number;
    pricing?: ProductPriceEntry;
    regularPricing?: ProductPriceEntry;
    variantPrices?: VariantPrice[];
};
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
  getProductWithVariant(product: Product, variantId: string) => Product; // merge Product object with Variant data if it exists
  getPrice: (product: Product) => AgnosticPrice;
  getName: (product: Product) => string;
  getSlug: (product: Product) => string;
  getDescription: (product: Product) => string; 
  getGallery(product: Product) => AgnosticMediaGalleryItem[];
  getSelectedKvas(product: Product, variantId?: string) => Record<string, AgnosticAttribute | string>
  getKvaItems(product: Product, metadata: Metadata, locale: string, selectedVariantId?: string) =>  KeyVariantAttributeItem[];
}

export interface AgnosticPrice {
    regular: number | null;
    special?: number | null;
}
export interface AgnosticMediaGalleryItem {
    small: string;
    normal: string;
    big: string;
}
export declare type KeyVariantAttributeItem = {
    values: KeyVariantAttributeItemValue[];
    title: string;
    propertyName?: string;
    propertyDataType?: string;
};
export declare type KeyVariantAttributeItemValue = {
    title: string;
    value: string;
    selected: boolean;
    disabled: boolean;
    relatedVariantIds?: any;
};
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useProduct, productGetters } from 'orc-vsf';

export default {
  setup () {
    const id = computed(() => route.value.params.id);
    const variantId = computed(() => route.value.query?.variant);
    const { products, search: searchProduct, loading } = useProduct(`product-${id}`);
    const { products: relatedProducts, search: searchRelatedProducts, loading: relatedLoading } = useProduct(`relatedPproducts-${id.value}`);
    const { products: productsFromQuery, search: searchQueryProducts , loading: queryLoading } = useProduct(`products-WomenDresses`);
    
    const product = computed(() => productGetters.getProductWithVariant(products.value, variantId.value));

    onSSR(async () => {
       await searchProduct({ queryType: 'Detail', id: id.value });
       await searchQueryProducts(({ queryType: 'Merchandising', queryName: 'WomenDresses', limit: 6}));
       await searchRelatedProducts({ queryType: 'Related', merchandiseTypes: ['CrossSell', 'UpSell'], product: product.value, limit: 8 });
    });

    return {
      product,
      loading,
      productGetters,
      relatedProducts,
      relatedLoading,
      productsFromQuery,
      queryLoading
    }
  }
}
```