# useSearch

## Features
`useMetadata` composable is responsible for fetching a data of product definitions and lookups

## API
```typescript
interface UseMetadata<any> {
  response: ComputedProperty<Metadata>;
  loading: ComputedProperty<boolean>;
  load: () => Promise<void>;
  error: ComputedProperty<UseSearchErrors>;
}

export declare type Metadata = {
    lookups: Lookup[];
    definitions: Definition[];
};
export declare type LookupValue = {
    id: string;
    value: string;
    lookupId: string;
    displayName: any;
    sortOrder: number;
    isActive: boolean;
    isSystem: boolean;
};
export declare type Lookup = {
    lookupName: string;
    values: LookupValue[];
    displayName: any;
    description: string;
    isActive: boolean;
    isSystem: boolean;
};
export declare type DefinitionProperty = {
    propertyName: string;
    displayName: any;
    isRequired: boolean;
    displayOrder: number;
    localizable: boolean;
    dataType: string;
    minimumValue: any;
    maximumValue: any;
    isSystem: true;
    includeInAllProductDefinition: true;
    includeInAllCategoryDefinition: true;
    includeInAllVariantDefinition: false;
    groupName: string;
    isHiddenInOrchestrator: boolean;
    isVariant: boolean;
    isVariantGroup: boolean;
    isKeyVariant: boolean;
    isFacettableAdmin: boolean;
    isFacettableWeb: boolean;
    maxMultiplicity: string;
};
export declare type DefinitionPropertyGroup = {
    properties: DefinitionProperty[];
};
export declare type Definition = {
    name: string;
    displayName: any;
    productType: string;
    sequenceNumber: number;
    properties: DefinitionProperty[];
    propertyGroups: DefinitionPropertyGroup[];
    variantProperties: DefinitionProperty[];
};
```

### `load`
Function that loading the metadata data. 

### `response`
Reactive data object containing the response from the backend.

### `loading`
Reactive object containing information about the loading state of search.

### `error`
Reactive object containing the error message, if search failed for any reason.

## Getters
````typescript
interface UseMetadataGetters<Metadata, Lookup>  {
 getLookup(metadata: Metadata, lookupName: string) => Lookup;
 getLookupValueDisplayName(metadata: Metadata, lookupName: string, lookupValue: string, locale: string) => string
}
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useMetadata, metadataGetters } from 'orc-vsf';

export default {
  setup () {
    const { load: loadMetadata, response: metadata } = useMetadata();
   

    onSSR(async () => {
      await loadMetadata();
    });

    return {
      metadata,
      metadataGetters
    }
  }
}
```