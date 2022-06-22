<template>
  <div class="cart-saving" v-if="hasDiscounts">
  <SfAccordion :multiple="false" transition="" showChevron>
    <SfAccordionItem header="Total">
      <template #header="{accordionClick}">
        <div @click="accordionClick" :style="{cursor: 'pointer'}">
          <SfProperty
            v-if="hasDiscounts"
            :name="$t('Total savings')"
            :value="$n(totalDiscountsAmount, 'currency')"
            class="sf-property--full-width sf-property--large property-saving-total"
          />
        </div>
      </template>
      <SfProperty
        v-if="productsDiscountAmount > 0"
        :name="$t('Items savings')"
        :value="$n(productsDiscountAmount, 'currency')"
        :class="['sf-property--full-width', 'sf-property--small property']"
      />
      <div v-if="hasRewards">
        <SfProperty
            v-for="(reward, i) in rewards"
            :key="i"
            :name="reward.promotionName"
            :value="$n(reward.amount, 'currency')"
            :class="['sf-property--full-width', 'sf-property--small property']"
          />
      </div>
    </SfAccordionItem>
  </SfAccordion>
  </div>

</template>

<script>
import { SfHeading, SfProperty, SfAccordion } from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import { useCart, cartGetters} from '@vue-storefront/orc-vsf';

export default {
  name: 'CartSaving',
  components: {
    SfHeading,
    SfProperty,
    SfAccordion
  },
  setup() {
    const { cart } = useCart();
    const items = computed(() => cartGetters.getItems(cart.value));
    const rewards = computed(() => cartGetters.getRewards(cart.value));
    const hasRewards = computed(() => rewards.value?.length > 0);
    const discounts = computed(() => cartGetters.getDiscounts(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const productsDiscountAmount = computed(
      () => items.value?.reduce((a, el) => ((el.defaultPrice - el.currentPrice) * el.quantity) + a, 0)
    );
    const totalDiscountsAmount = computed(() => totals.value?.discount + productsDiscountAmount.value);
    const hasDiscounts = computed(() => totalDiscountsAmount.value > 0);
    return {
      cartGetters,
      cart,
      rewards,
      hasRewards,
      discounts,
      productsDiscountAmount,
      totalDiscountsAmount,
      hasDiscounts
    };
  }
};
</script>
<style lang="scss" scoped>
.cart-saving {
  background-color: var(--c-light);
  padding: var(--spacer-xs);
  border: solid 1px var(--c-primary);
}

.property {
  --property-value-font-weight: var(--font-weight--normal);
}

.property-saving-total {
  color: var(--c-primary);
  --property-value-font-weight: var(--font-weight--medium);
}

.property-discount {
  color: var(--c-primary);
  padding-bottom: var(--spacer-xs);
}
</style>
