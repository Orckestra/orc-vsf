// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setProductsCoverImages = (products: any, cdnDamProviderConfig: any): void => {
  if (!products) return;
  const { serverUrl, imageFolderName } = cdnDamProviderConfig;
  products.forEach((pr: any) => {
    const imageUrl = pr.propertyBag?.ImageUrl;
    if (imageUrl) {
      pr.coverImage = imageUrl;
    } else {
      const variantId = pr.propertyBag?.VariantId;
      const productId = pr.productId ?? pr.propertyBag?.ProductId;
      pr.coverImage = `${serverUrl}/${imageFolderName}/${productId}_${variantId ? `${variantId}_` : ''}0_M.jpg`;
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setProductImage = (product: any, cdnDamProviderConfig: any): void => {
  if (!product) return;
  // In this case the new Media is present, so we can skip set up cdn medias
  if (product.mediaSet) return;

  const { serverUrl, imageFolderName, maxThumbnailImages } = cdnDamProviderConfig;
  const id = product.productId ?? product.id;
  product.media = [];
  for (let index = 0; index < maxThumbnailImages; index++) {
    product.media.push({
      small: `${serverUrl}/${imageFolderName}/${id}_${index}_M.jpg`,
      normal: `${serverUrl}/${imageFolderName}/${id}_${index}_L.jpg`,
      big: `${serverUrl}/${imageFolderName}/${id}_${index}_XL.jpg`
    });
  }

  product.variants?.forEach(variant => {
    variant.media = [];
    for (let index = 0; index < maxThumbnailImages; index++) {
      variant.media.push({
        small: `${serverUrl}/${imageFolderName}/${id}_${variant.id}_${index}_M.jpg`,
        normal: `${serverUrl}/${imageFolderName}/${id}_${variant.id}_${index}_L.jpg`,
        big: `${serverUrl}/${imageFolderName}/${id}_${variant.id}_${index}_XL.jpg`
      });
    }
  });
};
