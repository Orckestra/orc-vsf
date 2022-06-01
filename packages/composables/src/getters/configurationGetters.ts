import type { Configuration } from '@vue-storefront/orc-vsf-api';
import { UseConfigurationGetters } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getMinRequiredPasswordLength(result: Configuration): number {
  return result.membership.minRequiredPasswordLength;
}

function getMinRequiredNonAlphanumericCharacters(result: Configuration): number {
    return result.membership.minRequiredNonAlphanumericCharacters;
}

export const configurationGetters: UseConfigurationGetters<Configuration> = {
    getMinRequiredPasswordLength,
    getMinRequiredNonAlphanumericCharacters
};
