export const isGuidEmpty = (guid: string): boolean => {
  return (!guid ||
    guid === '00000000-0000-0000-0000-000000000000' ||
    guid === '00000000000000000000000000000000');
};