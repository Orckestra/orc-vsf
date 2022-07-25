<template>
  <div id="thank-you" v-if="order">
    <SfCallToAction
      v-e2e="'thank-you-banner'"
      class="banner"
      :title="`Thank you for your order, ${orderGetters.getCustomerName(order)}!`"
      :image="{
        mobile: addBasePath('/thankyou/bannerM.png'),
        desktop: addBasePath('/thankyou/bannerD.png'),
      }"
    >
      <template #description>
        <div class="banner__order-number">
          <span>{{ $t('Order No.') }}</span>
          <strong>{{ orderGetters.getNumber(order) }}</strong>
        </div>
         <SfProperty
          :name="$t('Total')"
          :value="$n(orderGetters.getTotal(order), 'currency')"
          class="sf-property sf-property--large property property-total"
      />
      </template>
    </SfCallToAction>
    <section class="section">
      <div class="order">
        <SfHeading
          title="Your Purchase"
          class="order__heading heading sf-heading--left"
          :level="3"
        />
        <p class="order__paragraph paragraph">
          {{ $t('Successful placed order').replace('{email}',  orderGetters.getCustomerEmail(order)) }}
        </p>

        <SfHeading
          title="Order Items"
          class="order__heading heading sf-heading--left"
          :level="3"
        />
        <div class="products">
          <div class="products__grid">
            <SfProductCard
                  v-e2e="'confirmation-product-card'"
                  v-for="(product, i) in cartGetters.getItems(cart)"
                  :key="cartGetters.getItemSku(product)"
                  :style="{ '--index': i }"
                  :title="cartGetters.getItemName(product)"
                  :image="addBasePath(cartGetters.getItemImage(product))"
                  :regular-price="$n(cartGetters.getItemPrice(product).regular, 'currency')"
                  :special-price="cartGetters.getItemPrice(product).special && $n(cartGetters.getItemPrice(product).special, 'currency')"
                  :show-add-to-cart-button="false"
                  class="products__product-card"
                  :link="localePath(cartGetters.getLink(product))"
                >
                <template #add-to-cart><strong>{{` x ${cartGetters.getItemQty(product)}`}}</strong></template>
                <template #wishlist-icon>{{''}}</template>
                </SfProductCard>
          </div>
           <SfButton v-if="isAuthenticated" @click="goToDetails"  class="details-button color-primary">Order Details</SfButton>
        </div>
      </div>

    </section>
      <section>

    </section>
    <SfButton class="back-button color-secondary button-size" @click="goToHome"
      >{{ $t('Go back to shop') }}</SfButton
    >
  </div>
</template>

<script>
import { SfHeading, SfButton, SfCallToAction, SfProperty, SfProductCard } from '@storefront-ui/vue';
import { computed, useRouter } from '@nuxtjs/composition-api';
import { addBasePath } from '@vue-storefront/core';
import { orderGetters, cartGetters, useOrder, useUser } from '@vue-storefront/orc-vsf';
import { onSSR } from '@vue-storefront/core';
export default {
  components: {
    SfHeading,
    SfButton,
    SfCallToAction,
    SfProperty,
    SfProductCard
  },
  setup(props, context) {
    context.emit('changeStep', 4);
    const { order: orderId } = context.root.$route.query;
    const { response: order, find: getOrder } = useOrder();
    const { isAuthenticated } = useUser();
    const router = useRouter();

    onSSR(async () => {
      await getOrder({ orderId });
    });

    const goToDetails = () => {
      const detailsUrl = { path: '/my-account/order-history', query: { order: orderGetters.getNumber(order.value) }};
      router.push(context.root.localePath(detailsUrl));
    };

    const goToHome = () => {
      router.push(context.root.localePath({ name: 'home' }));
    };

    return {
      isAuthenticated,
      order,
      cart: computed(() => orderGetters.getCart(order.value)),
      orderGetters,
      cartGetters,
      addBasePath,
      goToDetails,
      goToHome
    };
  }
};
</script>
<style lang="scss" scoped>
#thank-you {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    padding: 0 var(--spacer-sm);
    margin: 0 auto;
  }
}
.heading {
  --heading-padding: var(--spacer-base) 0;
  @include for-desktop {
    --heading-padding: var(--spacer-sm) 0 var(--spacer-xs) 0;
  }
}
.paragraph {
  margin: 0;
  color: var(--c-link);
  font: var(--font-weight--normal) var(--font-size--base) / 1.6
    var(--font-family--primary);
  @include for-desktop {
    font-weight: var(--font-weight--light);
    font-size: var(--font-size--sm);
    margin-bottom: var(--spacer-lg);
  }
}
.banner {
  --call-to-action-color: var(--c-text);
  --call-to-action-title-font-size: var(--h2-font-size);
  --call-to-action-title-font-weight: var(--font-weight--semibold);
  --call-to-action-text-container-width: 50%;
  @include for-desktop {
    margin: 0 0 var(--spacer-2xl) 0;
  }
  &__order-number {
    display: flex;
    flex-direction: column;
    font: var(--font-weight--light) var(--font-size--sm) / 1.4
      var(--font-family--primary);
    @include for-desktop {
      flex-direction: row;
      font-size: var(--font-size--normal);
    }
  }
}
.section {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  @include for-desktop {
    flex-direction: row;
    padding: 0;
    background: var(--c-light);
  }
}
.order {
  background: var(--c-light);
  padding-bottom: var(--spacer-sm);
  @include for-desktop {
    width: 100%;
    padding: var(--spacer-xl) var(--spacer-xl) var(--spacer-2xl)
      var(--spacer-2xl);
  }
  &__heading {
    --heading-title-font-weight: var(--font-weight--bold);
    @include for-desktop {
      --heading-title-color: var(--c-link);
      --heading-title-font-weight: var(--font-weight--swemibold);
    }
  }
  &__heading,
  &__paragraph,
  &__contact {
    @include for-mobile {
      margin: 0;
      padding-left: var(--spacer-sm);
      padding-right: var(--spacer-sm);
    }
  }
  &__contact {
    padding-bottom: var(--spacer-base);
    --heading-title-font-size: var(--font-size--lg);
    --heading-title-font-weight: var(--font-weight--medium);
    @include for-desktop {
      --heading-title-font-size: var(--font-size--base);
      --heading-title-font-weight: var(--font-weight--normal);
      padding: 0 var(--spacer-sm);
      border: 2px solid var(--c-white);
      border-width: 2px 0 2px 0;
    }
  }
  &__notifications-button {
    --button-width: calc(100% - var(--spacer-lg));
    margin: 0 auto;
    @include for-desktop {
      margin: var(--spacer-xl) 0 0 0;
    }
  }
}
.additional-info {
  --heading-title-font-weight: var(--font-weight--bold);
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--semibold);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--spacer-xl) var(--spacer-xl) var(--spacer-2xl)
      var(--spacer-2xl);
  }
}
.feedback-button {
  margin: var(--spacer-xl) 0 var(--spacer-sm) 0;
  @include for-desktop {
    margin: var(--spacer-base) 0 0 0;
  }
}
.back-button {
  --button-width: calc(100% - var(--spacer-lg));
  margin: 0 auto var(--spacer-sm) auto;
  @include for-desktop {
    margin: var(--spacer-xl) auto;
  }
}

.details-button {
  --button-width: calc(100% - var(--spacer-lg));
  margin: 0 auto var(--spacer-sm) auto;
  @include for-desktop {
    margin: var(--spacer-lg) auto 0 auto;
    --button-width: 25rem;
  }
}

.button-size {
  @include for-desktop {
    --button-width: 25rem;
  }
}
.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__grid {
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
    }
  }
  &__grid{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  &__product-card {
    --product-card-title-margin: var(--spacer-base) 0 0 0;
    --product-card-title-font-weight: var(--font-weight--medium);
    --product-card-title-margin: var(--spacer-xs) 0 0 0;
    --product-card-max-width: 10rem;
    --product-card-title-font-size: var(--font-size--sm);
    flex: 1 1 50%;
    @include for-desktop {
      --product-card-title-font-weight: var(--font-weight--normal);
      --product-card-add-button-bottom: var(--spacer-base);
      --product-card-title-margin: var(--spacer-sm) 0 0 0;
    }
  }
  @include for-desktop {
    &__grid {
      margin: var(--spacer-sm) 0 0 var(--spacer-sm);
    }
    &__product-card {
      flex: 1 1 25%;
    }
  }
}
</style>
