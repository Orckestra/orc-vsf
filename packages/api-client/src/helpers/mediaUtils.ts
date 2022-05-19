// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setProductsCoverImages = (products: any, cdnDamProviderConfig: any): void => {
  if (!products) return;
  const { serverUrl, imageFolderName } = cdnDamProviderConfig;
  products.forEach((pr: any) => {
    const imageUrl = pr.propertyBag?.ImageUrl;
    if (imageUrl) {
      pr.coverImage = imageUrl;
    } else {
      const variantId = pr.propertBag?.VarialtId;
      pr.coverImage = `${serverUrl}/${imageFolderName}/${pr.productId}_${variantId ? `${variantId}_` : ''}0_M.jpg`;
    }
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setCartItemsCoverImages = (items: any, cdnDamProviderConfig: any): void => {
  if (!items) return;
  const { serverUrl, imageFolderName } = cdnDamProviderConfig;
  items.forEach((pr: any) => {
    const imageUrl = pr.propertyBag?.ImageUrl;
    if (imageUrl) {
      pr.coverImage = imageUrl;
    } else {
      pr.coverImage = `${serverUrl}/${imageFolderName}/${pr.productId}_${pr.variantId ? `${pr.variantId}_` : ''}0_M.jpg`;
    }
  });
};

