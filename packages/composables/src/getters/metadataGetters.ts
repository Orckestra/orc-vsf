import type { Metadata, Lookup } from '@vue-storefront/orc-vsf-api';
import { UseMetadataGetters } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLookup(metadata: Metadata, lookupName: string): Lookup {
  if (!metadata?.lookups) return;
  return metadata.lookups.find(l => l.lookupName === lookupName);
}

function getLookupValueDisplayName(metadata: Metadata, lookupName: string, lookupValue: string, locale: string): string {
  if (!metadata?.lookups) return;
  const lookup = metadata.lookups.find(l => l.lookupName === lookupName);
  if (lookup && lookup.values) {
    const foundValue = lookup.values.find(v => v.value === lookupValue);
    return foundValue?.displayName[locale];
  }
  return '';
}

export const metadataGetters: UseMetadataGetters<Metadata, Lookup> = {
  getLookup,
  getLookupValueDisplayName
};
