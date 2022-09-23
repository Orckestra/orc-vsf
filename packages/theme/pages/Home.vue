<template>
  <div id="home">
    <LazyHydrate when-idle>
      <SfHero class="hero">
        <SfHeroItem
          v-for="(hero, i) in heroes"
          :key="i"
          :title="hero.title"
          :subtitle="hero.subtitle"
          :background="hero.background"
          :image="hero.image"
          :class="hero.className"
        />
      </SfHero>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfBannerGrid :banner-grid="1" class="banner-grid">
        <template v-for="item in banners" v-slot:[item.slot]>
          <SfBanner
            :key="item.slot"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :button-text="item.buttonText"
            :link="localePath(item.link)"
            :image="item.image"
            :class="item.class"
          />
        </template>
      </SfBannerGrid>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <div class="similar-products" v-if="productsFromQuery">
        <SfHeading title="Summer wear" :level="2"/>
        <nuxt-link :to="localePath('/summerwear')" class="smartphone-only">
          {{ $t('See all') }}
        </nuxt-link>
      </div>
    </LazyHydrate>

    <LazyHydrate when-visible>
        <SfCarousel class="carousel" :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }">
          <template #prev="{go}">
            <SfArrow
              aria-label="prev"
              class="sf-arrow--left sf-arrow--long"
              @click="go('prev')"
            />
          </template>
          <template #next="{go}">
            <SfArrow
              aria-label="next"
              class="sf-arrow--right sf-arrow--long"
              @click="go('next')"
            />
          </template>
          <SfCarouselItem class="carousel__item" v-for="(product, i) in productsFromQuery" :key="i">
            <SfProductCard
              :title="productGetters.getName(product)"
              :image="productGetters.getCoverImage(product)"
              :image-height="326"
              :image-width="216"
              :regular-price="$n(productGetters.getPrice(product).regular, 'currency')"
              :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
              :show-add-to-cart-button="true"
              :is-added-to-cart="isInCart({ product })"
              @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
              :link="localePath(productGetters.getLink(product))"
              class="carousel__item__product"
              :is-in-wishlist="isInWishlist({ product })"
              @click:wishlist="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)"
            />
          </SfCarouselItem>
        </SfCarousel>
    </LazyHydrate>
    <LazyHydrate when-visible>
      <div class="see-all">
        <SfButton
              class="color-primary sf-button"
             :link="localePath(`/q/SummerWear`)"
            >
            {{ $t('See all') }}
        </SfButton>
      </div>
    </LazyHydrate>
    <LazyHydrate when-visible>
      <div class="similar-products" v-if="productsFromSet">
        <SfHeading title="Featured set" :level="2"/>
      </div>
    </LazyHydrate>

    <LazyHydrate when-visible>
        <SfCarousel class="carousel" :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }">
          <template #prev="{go}">
            <SfArrow
              aria-label="prev"
              class="sf-arrow--left sf-arrow--long"
              @click="go('prev')"
            />
          </template>
          <template #next="{go}">
            <SfArrow
              aria-label="next"
              class="sf-arrow--right sf-arrow--long"
              @click="go('next')"
            />
          </template>
          <SfCarouselItem class="carousel__item" v-for="(product, i) in productsFromSet" :key="i">
            <SfProductCard
              :title="productGetters.getName(product)"
              :image="productGetters.getCoverImage(product)"
              :image-height="326"
              :image-width="216"
              :regular-price="$n(productGetters.getPrice(product).regular, 'currency')"
              :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
              :show-add-to-cart-button="true"
              :is-added-to-cart="isInCart({ product })"
               @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
              :link="localePath(productGetters.getLink(product))"
              class="carousel__item__product"
              :is-in-wishlist="isInWishlist({ product })"
              @click:wishlist="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)"
            />
          </SfCarouselItem>
        </SfCarousel>
    </LazyHydrate>
    <LazyHydrate when-visible>
      <div class="see-all">
        <SfButton
              class="color-primary sf-button"
             :link="localePath(`/s/FeaturedProducts`)"
            >
            {{ $t('See all') }}
        </SfButton>
      </div>
    </LazyHydrate>
  </div>
</template>
<script>
import {
  SfHero,
  SfBanner,
  SfCallToAction,
  SfSection,
  SfCarousel,
  SfProductCard,
  SfImage,
  SfBannerGrid,
  SfHeading,
  SfArrow,
  SfButton
} from '@storefront-ui/vue';

import { computed, useContext } from '@nuxtjs/composition-api';
import NewsletterModal from '~/components/NewsletterModal.vue';
import LazyHydrate from 'vue-lazy-hydration';
import { useUiState } from '../composables';
import { addBasePath, onSSR } from '@vue-storefront/core';
import { useProduct, productGetters, useCart, useWishlist, wishlistGetters} from 'orc-vsf';

export default {
  name: 'Home',
  components: {
    SfHero,
    SfBanner,
    SfCallToAction,
    SfSection,
    SfCarousel,
    SfProductCard,
    SfImage,
    SfBannerGrid,
    SfHeading,
    SfArrow,
    SfButton,
    NewsletterModal,
    LazyHydrate
  },
  setup() {
    const { $config } = useContext();
    const { toggleNewsletterModal } = useUiState();
    const { addItem: addItemToCart, isInCart } = useCart();
    const { addItem: addItemToWishlist, isInWishlist, removeItem: removeItemFromWishlist, wishlist } = useWishlist();
    const { products: productsFromQuery, search: getQueryProducts } = useProduct('products-home-query');
    const { products: productsFromSet, search: getSetProducts } = useProduct('products-home-set');
    const heroes = [
      {
        title: 'Colorful summer dresses are already in store',
        subtitle: 'SUMMER COLLECTION 2019',
        background: '#eceff1',
        image: '/homepage/bannerH.webp'
      },
      {
        title: 'Colorful summer dresses are already in store',
        subtitle: 'SUMMER COLLECTION 2019',
        background: '#efebe9',
        image: '/homepage/bannerA.webp',
        className:
          'sf-hero-item--position-bg-top-left sf-hero-item--align-right'
      },
      {
        title: 'Colorful summer dresses are already in store',
        subtitle: 'SUMMER COLLECTION 2019',
        background: '#fce4ec',
        image: '/homepage/bannerB.webp'
      }
    ];
    const banners = [
      {
        slot: 'banner-A',
        subtitle: 'Dresses',
        title: 'Cocktail & Party',
        description:
          'Find stunning women\'s cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands.',
        buttonText: 'Shop now',
        image: {
          mobile: $config.theme.home.bannerA.image.mobile,
          desktop: $config.theme.home.bannerA.image.desktop
        },
        class: 'sf-banner--slim desktop-only',
        link: $config.theme.home.bannerA.link
      },
      {
        slot: 'banner-B',
        subtitle: 'Dresses',
        title: 'Linen Dresses',
        description:
          'Find stunning women\'s cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands.',
        buttonText: 'Shop now',
        image: $config.theme.home.bannerB.image,
        class: 'sf-banner--slim banner-central desktop-only',
        link: $config.theme.home.bannerB.link
      },
      {
        slot: 'banner-C',
        subtitle: 'T-Shirts',
        title: 'The Office Life',
        image: $config.theme.home.bannerC.image,
        class: 'sf-banner--slim banner__tshirt',
        link: $config.theme.home.bannerC.link
      },
      {
        slot: 'banner-D',
        subtitle: 'Summer Sandals',
        title: 'Eco Sandals',
        image: $config.theme.home.bannerD.image,
        class: 'sf-banner--slim',
        link: $config.theme.home.bannerD.link
      }
    ];

    onSSR(async () => {
      if (!productsFromQuery.value?.products) {
        await getQueryProducts({ queryType: 'Merchandising', queryName: 'SummerWear', limit: 6});
      }
      if (!productsFromSet.value?.products) {
        await getSetProducts({ queryType: 'ProductSet', queryName: 'FeaturedProducts', limit: 6});
      }
    });

    const onSubscribe = (emailAddress) => {
      console.log(`Email ${emailAddress} was added to newsletter.`);
      toggleNewsletterModal();
    };

    const removeProductFromWishlist = (productItem) => {
      const wishListItems = wishlistGetters.getItems(wishlist.value);
      const sku = productItem.sku ?? productItem.propertyBag?.Sku;
      const product = wishListItems.find(i => i.sku === sku);
      removeItemFromWishlist({ product });
    };

    return {
      toggleNewsletterModal,
      onSubscribe,
      addBasePath,
      banners,
      heroes,
      productsFromQuery: computed(() => productsFromQuery.value?.products),
      productsFromSet: computed(() => productsFromSet.value?.products),
      productGetters,
      addItemToCart,
      isInCart,
      addItemToWishlist,
      isInWishlist,
      removeProductFromWishlist
    };
  }
};
</script>

<style lang="scss" scoped>
#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}

.hero {
  margin: var(--spacer-xl) auto var(--spacer-lg);
  --hero-item-background-position: center;
  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
  }
  .sf-hero-item {
    &:nth-child(even) {
      --hero-item-background-position: left;
      @include for-mobile {
        --hero-item-background-position: 30%;
        ::v-deep .sf-hero-item__subtitle,
        ::v-deep .sf-hero-item__title {
          text-align: right;
          width: 100%;
          padding-left: var(--spacer-sm);
        }
      }
    }
  }
  ::v-deep .sf-hero__control {
    &--right, &--left {
      display: none;
    }
  }
}

.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;
  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
      text-decoration: none;
    }
  }
}

.banner {
  &__tshirt {
    background-position: left;
  }
  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}

.see-all {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacer-xl);
}

.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}

.call-to-action {
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
}

.carousel {
    margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }
    &__product {
      --product-card-add-button-transform: translate3d(0, 30%, 0);
    }
  }
  ::v-deep .sf-arrow--long .sf-arrow--right {
    --arrow-icon-transform: rotate(180deg);
     -webkit-transform-origin: center;
     transform-origin: center;
  }
}

</style>
