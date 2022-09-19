// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getImagUrl = (product, serverUrl, imageFolderName) => {
  const imageUrl = product.propertyBag?.ImageUrl;
  if (!imageUrl) return imageUrl;

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  } else {
    return `${serverUrl}/${imageFolderName}/${imageUrl.replace('~/', '')}`;
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setProductsCoverImages = (products: any, mediaProviderConfig: any): void => {
  if (!products) return;
  const { serverUrl, imageFolderName } = mediaProviderConfig;
  products.forEach((pr: any) => {
    const imageUrl = getImagUrl(pr, serverUrl, imageFolderName);
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
export const setCartItemsCoverImages = (items: any, mediaProviderConfig: any): void => {
  if (!items) return;
  const { serverUrl, imageFolderName } = mediaProviderConfig;
  items.forEach((pr: any) => {
    const imageUrl = getImagUrl(pr, serverUrl, imageFolderName);
    if (imageUrl) {
      pr.coverImage = imageUrl;
    } else {
      pr.coverImage = `${serverUrl}/${imageFolderName}/${pr.productId}_${pr.variantId ? `${pr.variantId}_` : ''}0_M.jpg`;
    }
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const setImagUrlForMediaSet = (product, serverUrl, imageFolderName) => {
  const setItemurl = (item) => {
    const imageUrl = item.url;
    if (!imageUrl.startsWith('http')) {
      item.url = `${serverUrl}/${imageFolderName}/${imageUrl.replace('~/', '')}`;
    }
  };

  product.mediaSet.forEach(item => {
    setItemurl(item);
    item.resizedInstances.forEach(resize => {
      setItemurl(resize);
    });
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setProductImage = (product: any, mediaProviderConfig: any): void => {
  if (!product) return;
  const { serverUrl, imageFolderName, maxThumbnailImages } = mediaProviderConfig;
  // In this case the new Media is present, so we can skip set up cdn medias
  if (product.mediaSet) {
    setImagUrlForMediaSet(product, serverUrl, imageFolderName);
    return;
  }

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
