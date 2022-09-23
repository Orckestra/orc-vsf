import type { Configuration, MembershipConfiguration } from 'orc-vsf-api';
import { UseConfigurationGetters } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getMinRequiredPasswordLength(config: Configuration): number {
  return config?.membership?.minRequiredPasswordLength;
}

function getMinRequiredNonAlphanumericCharacters(config: Configuration): number {
  return config?.membership?.minRequiredNonAlphanumericCharacters;
}

function getMembershipConfiguration(config: Configuration) : MembershipConfiguration {
  return config?.membership;
}

export const configurationGetters: UseConfigurationGetters<Configuration, MembershipConfiguration> = {
  getMinRequiredPasswordLength,
  getMinRequiredNonAlphanumericCharacters,
  getMembershipConfiguration
};
