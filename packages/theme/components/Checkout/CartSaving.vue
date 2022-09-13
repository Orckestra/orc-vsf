<template>
  <div class="cart-saving" v-if="hasDiscounts">
      <SfProperty
        v-if="itemsDiscountsAmount > 0"
        :name="$t('Items savings')"
        :value="$n(itemsDiscountsAmount, 'currency')"
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
      <SfProperty
            v-if="hasDiscounts"
            :name="$t('Total savings')"
            :value="$n(totalDiscountsAmount, 'currency')"
            class="sf-property--full-width sf-property--large property-saving-total"
      />
  </div>
</template>

<script>
import { SfHeading, SfProperty } from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import { useCart, cartGetters} from 'orc-vsf';

export default {
  name: 'CartSaving',
  components: {
    SfHeading,
    SfProperty
  },
  setup() {
    const { cart } = useCart();
    const rewards = computed(() => cartGetters.getRewards(cart.value));
    const hasRewards = computed(() => rewards.value?.length > 0);
    const itemsDiscountsAmount = computed(() => cartGetters.getItemsDiscountsAmount(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));

    const totalDiscountsAmount = computed(() => totals.value?.discount + itemsDiscountsAmount.value);
    const hasDiscounts = computed(() => totalDiscountsAmount.value > 0);
    return {
      cartGetters,
      cart,
      rewards,
      hasRewards,
      itemsDiscountsAmount,
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
