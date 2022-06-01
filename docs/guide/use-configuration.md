# useConfiguration

## Features
`useConfiguration` composable is responsible for getting configuration.

## API

```typescript

export type MembershipConfiguration = {
    minRequiredPasswordLength: number,
    minRequiredNonAlphanumericCharacters: number,
    accountLockDownMinutes: number,
    enablePasswordReset: boolean,
    enablePasswordRetrieval: boolean,
    maxInvalidPasswordAttempts: number,
    passwordAttemptWindow: number,
    passwordFailedAttemptDelaySeconds: number,
    passwordStrategy: string,
    passwordStrengthRegularExpression: string,
    requiresQuestionAndAnswer: boolean,
    requiresUniqueEmail: boolean,
    tokenExpirationMinutes: number
}

export type Configuration = {
    membership: MembershipConfiguration
}

interface UseConfiguration = useConfigurationFactory<Configuration>  {
  load: async (context: Context) => Promise<void>;
}

export interface UseConfigurationFactoryParams<Configuration> extends FactoryParams {
  load(context: Context): Promise<Configuration>
}

export interface useConfigurationInterface<Configuration> {
  load(): Promise<void>;
  loading: ComputedProperty<boolean>;
  response: ComputedProperty<Configuration>;
  error: ComputedProperty<UseConfigurationErrors>;
}

export interface useConfiguration<Configuration> {
  (): useConfigurationInterface<Configuration>;
}

export interface UseConfigurationErrors {
  load: Error | null;
  change: Error | null;
}

export interface UseConfigurationGetters<Configuration, MembershipConfiguration> {
  getMinRequiredPasswordLength(config: Configuration): number;
  getMinRequiredNonAlphanumericCharacters(config: Configuration): number;
  getMembershipConfiguration(config: Configuration) : MembershipConfiguration;
}

```
### `load`
Function that load configuration info.

## Getters
````typescript
interface ConfigurationGetters<Configuration> {
  getMinRequiredPasswordLength(config: Configuration): number;
  getMinRequiredNonAlphanumericCharacters(config: Configuration): number;
  getMembershipConfiguration(config: Configuration) : MembershipConfiguration;
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