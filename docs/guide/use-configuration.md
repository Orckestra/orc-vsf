# useConfiguration

## Features
`useConfiguration` composable is responsible for getting configuration.

## API

```typescript
interface UseConfiguration = useConfigurationFactory<Configuration>  {
  load: async (context: Context) => Promise<void>;
}

export interface UseConfigurationFactoryParams<CONFIGURATION> extends FactoryParams {
  load(context: Context): Promise<CONFIGURATION>
}

export interface useConfigurationInterface<CONFIGURATION> {
  load(): Promise<void>;
  loading: ComputedProperty<boolean>;
  response: ComputedProperty<CONFIGURATION>;
  error: ComputedProperty<UseConfigurationErrors>;
}

export interface useConfiguration<CONFIGURATION> {
  (): useConfigurationInterface<CONFIGURATION>;
}

export interface UseConfigurationErrors {
  load: Error | null;
  change: Error | null;
}

export interface UseConfigurationGetters<CONFIGURATION> {
  getMinRequiredPasswordLength(result: CONFIGURATION): number;
  getMinRequiredNonAlphanumericCharacters(result: CONFIGURATION): number;
}

```
### `load`
Function that load configuration info.

## Getters
````typescript
interface ConfigurationGetters<Configuration> {
  getMinRequiredPasswordLength(result: Configuration): number;
  getMinRequiredNonAlphanumericCharacters(result: Configuration): number
}
````

## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useConfiguration, configurationGetters } from '@vue-storefront/orc-vsf';

export default {
  setup () {
    const { load: loadConfiguration, response: configuration } = useConfiguration();
   

    onSSR(async () => {
      await loadConfiguration();
    });

    return {
      configuration,
      configurationGetters
    }
  }
}
```