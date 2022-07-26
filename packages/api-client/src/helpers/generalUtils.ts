export const isGuidEmpty = (guid: string): boolean => {
  return (
    !guid ||
    guid === '00000000-0000-0000-0000-000000000000' ||
    guid === '00000000000000000000000000000000'
  );
};

/* eslint-disable */
export const isGuidEquals = (guid1: string, guid2: string): boolean => {
  const rgx = /[\{\-\}]/g;
  const txtLeft = guid1.replace(rgx, '').toUpperCase();
  const txtRight = guid2.replace(rgx, '').toUpperCase();
  return txtLeft === txtRight;
};

