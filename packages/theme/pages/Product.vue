<template>
  <SfLoader
    :class="{ 'loading': productLoading }"
    :loading="productLoading">
    <div id="product">
      <SfBreadcrumbs
        class="breadcrumbs desktop-only"
        :breadcrumbs="breadcrumbs"
      >
      <template #link="{ breadcrumb }">
        <nuxt-link
          :data-testid="breadcrumb.text"
          :to="breadcrumb.link ? localePath(breadcrumb.link) : ''"
          class="sf-link disable-active-link sf-breadcrumbs__breadcrumb"
        >
          {{ breadcrumb.text }}
        </nuxt-link>
      </template>
      <template #current="{ breadcrumb }">
        <nuxt-link
          :data-testid="breadcrumb.text"
          :to="breadcrumb.link ? localePath(breadcrumb.link) : ''"
          class="sf-link disable-active-link sf-breadcrumbs__breadcrumb"
        >
          {{ breadcrumb.text }}
        </nuxt-link>
      </template>
    </SfBreadcrumbs>
      <div class="product">
        <LazyHydrate when-idle>
          <SfGallery :images="productGallery" class="product__gallery" />
        </LazyHydrate>

        <div class="product__info">
          <div class="product__header">
            <SfHeading
              :title="productGetters.getName(product)"
              :level="3"
              class="sf-heading--no-underline sf-heading--left"
            />
            <SfIcon
              icon="drag"
              size="xxl"
              color="var(--c-text-disabled)"
              class="product__drag-icon smartphone-only"
            />
          </div>
          <div>
            <div class="product__kvas" v-for="kva in kvas" :key="kva.propertyName">
              <SfComponentSelect
                v-if="kva.propertyName === 'Colour'"
                label="Color"
                :selected="configuration[kva.propertyName]"
                :size="5"
                :required="false"
                :disabled="false"
                :persistent="false"
                @change="changedValue => updateFilter({ Colour: changedValue })"
              >
                <SfComponentSelectOption :class="color.disabled ? 'disabled': color.value" v-for="(color, i) in kva.values" :value="color.value" :key="i">
                  <SfProductOption :label="color.disabled ? `${color.title} - unavailable`: color.title" :color="colorsMap[color.value] ? colorsMap[color.value]: color.value" />
                </SfComponentSelectOption>

              </SfComponentSelect>

              <SfSelect
              v-if="kva.propertyName === 'RetailSize'"
              label="Size"
              class="sf-select--underlined product__select-size"
              :required="true"
              :value="configuration[kva.propertyName]"
              @input="size => size.diabled ? null : updateFilter({ RetailSize: size })"
              >
                <SfSelectOption
                  v-for="size in kva.values"
                  :key="size.value"
                  :value="size.value"
                  :class="size.disabled ? 'disabled': ''"
                 >
                  {{size.title}} {{size.disabled ? '- unavailable': ''}}
                </SfSelectOption>
              </SfSelect>

              <!--div v-if="kva.propertyName === 'Colour' && kva.values.length > 0" class="product__colors desktop-only">
                <p class="product__color-label">{{ $t('Color') }}:</p>
                <SfColor
                  v-for="(color, i) in kva.values"
                  :key="i"
                  :color="color.value"
                  :selected="configuration[kva.propertyName] === color.value"
                  :class="`product__color ${color.value}`"
                  @click="updateFilter({ Colour: color.value })"
                />
              </div-->
            </div>
            <div class="product__price-and-rating">
            <SfPrice
              :regular="$n(productGetters.getPrice(product).regular, 'currency')"
              :special="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
            />
          </div>
            <SfLoader
              :class="{ 'loading': loadingInventory }"
              :loading="loadingInventory">
              <div>
              <SfAddToCart
                  v-e2e="'product_add-to-cart'"
                  :stock="availableQty"
                  v-model="qty"
                  :disabled="loading || availableQty === 0"
                  :canAddToCart="availableQty > 0"
                  class="product__add-to-cart"
                  @click="addItem({ product, quantity: parseInt(qty) })"
              />
             <span class="product__available-qty">({{availableQty}} available)</span>
             </div>
            </SfLoader>
          </div>
          <LazyHydrate when-idle>
            <SfTabs :open-tab="1" class="product__tabs">
              <SfTab title="Description">
                <div v-html="productGetters.getDescription(product)" class="product__description">
                </div>

              </SfTab>
              <SfTab
                title="Additional Information"
                class="product__additional-info"
              >
              <SfProperty
                  name="Brand"
                  :value="productBrand"
                  class="product__property"
                />
              <SfProperty
                  v-if="breadcrumbs.length"
                  name="Category"
                  :value="breadcrumbs[breadcrumbs.length - 1].text"
                  class="product__property"
                />
              </SfTab>
            </SfTabs>
          </LazyHydrate>
        </div>
      </div>

      <LazyHydrate when-visible>
        <RelatedProducts
          :products="relatedProducts"
          :loading="relatedLoading"
          title="Match it with"
        />
      </LazyHydrate>

      <LazyHydrate when-visible>
        <InstagramFeed />
      </LazyHydrate>
    </div>
  </SfLoader>
</template>
<script>
import {
  SfProperty,
  SfHeading,
  SfPrice,
  SfSelect,
  SfComponentSelect,
  SfProductOption,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfIcon,
  SfImage,
  SfBanner,
  SfAlert,
  SfSticky,
  SfBreadcrumbs,
  SfButton,
  SfColor,
  SfLoader
} from '@storefront-ui/vue';

import InstagramFeed from '~/components/InstagramFeed.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import { ref, computed, useRoute, useRouter } from '@nuxtjs/composition-api';
import { useProduct, useCart, useCategory, productGetters, categoryGetters, useMetadata, metadataGetters, useInventory, inventoryGetters } from '@vue-storefront/orc-vsf';
import { onSSR } from '@vue-storefront/core';
import LazyHydrate from 'vue-lazy-hydration';
import { addBasePath } from '@vue-storefront/core';

export default {
  name: 'Product',
  transition: 'fade',
  setup() {
    const qty = ref(1);
    const route = useRoute();
    const router = useRouter();
    const { locale } = router.app.$i18n;
    const id = computed(() => route.value.params.id);
    const variantId = computed(() => route.value.query?.variant);
    const { categories } = useCategory('categories');
    const { find: findInventory, result: inventoryResult, loading: loadingInventory } = useInventory('productInventory');
    const { products, search: searchProduct, loading: productLoading } = useProduct(`product-${id.value}`);
    const { products: relatedProducts, search: searchRelatedProducts, loading: relatedLoading } = useProduct('relatedProducts');
    const { addItem, loading } = useCart();
    const { response: metadata } = useMetadata();
    const product = computed(() => productGetters.getProductWithVariant(products.value, variantId.value));
    const productBrand = computed(() => metadataGetters.getLookupValueDisplayName(metadata?.value, 'Brand', product?.value.brand, locale));
    const options = computed(() => productGetters.getAttributes(product.value, []));
    const configuration = computed(() => productGetters.getSelectedKvas(product.value, variantId?.value));
    const productCategories = computed(() => productGetters.getCategoryIds(product.value));
    const breadcrumbs = computed(() => categoryGetters.getBreadcrumbs(categories.value, productCategories.value[0]));
    const kvas = computed(() => productGetters.getKvaItems(product.value, metadata?.value, locale, variantId.value));
    const productGallery = computed(() => productGetters.getGallery(product.value).map(img => ({
      mobile: { url: addBasePath(img.small) },
      desktop: { url: addBasePath(img.normal) },
      big: { url: addBasePath(img.big) },
      alt: product?.value?._name || product?.value?.name
    })));
    const availableQty = computed(() => inventoryGetters.getSkuAvailableQuantity(inventoryResult.value, product.value?.sku));

    onSSR(async () => {
      if (!product.value || !product.value.id || product.value.id !== id.value) {
        await searchProduct({ queryType: 'DETAIL', id: id.value });
        await searchRelatedProducts({ catId: [productCategories.value[0]], limit: 8 });
      }
      if (product.value && product.value.sku) {
        await findInventory({skus: [product.value.sku], inventoryLocationId: 'BRC-Warehouse-5000', date: '2022-05-25T13:29:35.063Z'});
      }
    });

    const updateFilter = (filter) => {
      if (!product?.value?.variants) return;
      const keys = Object.keys(configuration.value);
      const merged = { ...configuration.value, ...filter};

      const compareProperties = (pr) => {
        return keys.reduce((result, current) => result && (pr[current] && pr[current] === merged[current]), true);
      };

      const variant = product.value.variants.find(v => compareProperties(v.propertyBag));
      if (!variant) return;

      router.push({
        path: route.value.path,
        query: {
          variant: variant.id
        }
      });
    };

    return {
      breadcrumbs,
      updateFilter,
      configuration,
      product,
      relatedProducts: computed(() => productGetters.getFiltered(relatedProducts.value, { master: true })),
      relatedLoading,
      options,
      qty,
      addItem,
      loading,
      productLoading,
      productGetters,
      productGallery,
      productBrand,
      kvas,
      availableQty,
      loadingInventory
    };
  },
  components: {
    SfAlert,
    SfColor,
    SfProperty,
    SfHeading,
    SfPrice,
    SfSelect,
    SfComponentSelect,
    SfProductOption,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfImage,
    SfBanner,
    SfSticky,
    SfBreadcrumbs,
    SfButton,
    InstagramFeed,
    RelatedProducts,
    LazyHydrate,
    SfLoader
  },
  /* eslint-disable camelcase */
  data() {
    return {
      stock: 5,
      colorsMap: {
        chic_cream: '#fffdd0',
        british_khaki: '#c3b091',
        polo_black: 'black',
        newport_navy: 'navy',
        wicket_yellow: 'yellow',
        rl2000_red: 'red',
        andover_heather: '#bbb9cd',
        chatham_blue: 'blue',
        carmel_pink: 'pink',
        ink: 'pink',
        midnight: '#152744',
        olive_forest: '#578F29',
        peyote: '#C2B191',
        cloud: '#396b89',
        bungee_cord: '#696156',
        sun: '#FCE570',
        bluebrown: 'blue',
        faded_rose: 'rose',
        silvery_grey: 'grey',
        black_snake: 'black',
        light_grey_heather: 'grey',
        mallet: '',
        tuscany_tan: '',
        copper: '',
        multi_combo: '',
        storm: '',
        light_purple: 'purple',
        della_robia: '',
        grey_mix: 'grey',
        neptune: 'navy',
        hudson_tan: '',
        evergreen: 'green',
        black_ivory: 'black',
        hawaiian_ocean: 'blue',
        abstract_seas: '',
        black_pony: 'black',
        light_french_blue: 'blue',
        taupe: '',
        rust: '',
        burlap: '',
        blue_paisley: 'blue',
        mountain: '',
        paprika: '',
        american_dream: '',
        khaki_w_brown_lthr: 'brown'

      },
      properties: [
        {
          name: 'Product Code',
          value: '578902-00'
        },
        {
          name: 'Category',
          value: 'Pants'
        },
        {
          name: 'Material',
          value: 'Cotton'
        },
        {
          name: 'Country',
          value: 'Germany'
        }
      ],
      detailsIsActive: false };
  }
};
</script>

<style lang="scss" scoped>
#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}
.product {
  @include for-desktop {
    display: flex;
  }
  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }
  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__kvas {
    margin: var(--spacer-sm) 0 var(--spacer-base);
  }
  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    --price-special-font-size: var(--h3-font-size);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-sm) 0;
    }
  }
  &__available-qty {
    color: #ccc;
  }
  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }
  &__count {
    @include font(
      --count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }
  &__description {
    @include font(
      --product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }
  &__colors {
    @include font(
      --product-color-font,
      var(--font-weight--normal),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }
  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }
  &__color {
    margin: 0 var(--spacer-2xs);
  }
  &__add-to-cart {
    margin: 0 var(--spacer-base) var(--spacer-sm) 0;
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }
  &__compare {
    margin-top: 0;
  }
  &__tabs {
    --tabs-title-z-index: 0;
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
    &__button {
      --button-font-size: var(--font-size--base);
    }
  }
  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }
  &__additional-info {
    color: var(--c-link);
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary)
    );
    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);
      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }
    &__paragraph {
      margin: 0;
    }
  }
  &__gallery {
    flex: 1;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

.disabled  {
  color: #ccc;
}
</style>
