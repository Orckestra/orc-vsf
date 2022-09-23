<template>
  <div>

    <div class="promo-code">
      <SfInput
        v-model="promoCode"
        name="promoCode"
        :label="$t('Enter promo code')"
        class="sf-input--filled promo-code__input"
      />
      <SfButton
        class="promo-code__button"
        :disabled="loading"
        @click="handleAddCoupon"
      >
        {{ $t('Apply') }}
      </SfButton>
    </div>
    <div v-if="promosApplied.length">
      <SfProperty
        v-for="c in promosApplied"
        :key="c.id"
        :name="c.name"
        :value="$n(c.value, 'currency')"
        class="sf-property--full-width property sf-property--large"
      >
      <template #name>
        <span class="applied-coupon__code">{{c.code}}</span>
        <span>{{c.name}}</span>
      </template>
      <template #value>
        <span>{{$n(c.value, 'currency')}}</span>
        <SfCircleIcon
          icon="cross"
          :aria-label="'Remove'"
          class="sf-circle-icon--small color-warning"
          @click="handleRemoveCoupon(c.code)"
        />
      </template>
      </SfProperty>
    </div>
  </div>
</template>

<script>
import { SfButton, SfInput, SfProperty, SfCircleIcon } from '@storefront-ui/vue';
import { useCart, cartGetters } from 'orc-vsf';
import {
  computed,
  ref,
  defineComponent
} from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';

export default defineComponent({
  name: 'CouponCode',
  components: {
    SfButton,
    SfInput,
    SfProperty,
    SfCircleIcon
  },
  setup() {
    const { cart, applyCoupon, removeCoupon, loading } = useCart();
    const promoCode = ref('');
    const messages = computed(() => cartGetters.getCouponStateMessages(cart.value));
    const invalidCoupons = computed(() => cartGetters.getInvalidCoupons(cart.value));
    const { send: sendNotification } = useUiNotification();
    const promosApplied = computed(
      () => cartGetters.getCoupons(cart.value) ?? []
    );

    const handleAddCoupon = async () => {
      await applyCoupon({ currentCart: cart.value, couponCode: promoCode.value });
      if (messages.value && messages.value.length) {
        sendNotification({
          id: Symbol('coupon_error'),
          message: messages.value[0],
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'Coupon'});
      }

      if (promosApplied.value?.find(c => c.code === promoCode.value)) {
        sendNotification({
          id: Symbol('coupon_success'),
          message: `Promotional code ${promoCode.value} was added successfully.`,
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'Coupon'});
      }

      if (invalidCoupons.value && invalidCoupons.value.length) {
        const tasksToRemove = invalidCoupons.value.map(c => {
          removeCoupon({ currentCart: cart.value, couponCode: c.couponCode });
        });

        await Promise.all(tasksToRemove);
      }
    };

    const handleRemoveCoupon = async (couponCode) => {
      await removeCoupon({ currentCart: cart.value, couponCode });
      sendNotification({
        id: Symbol('coupon_success'),
        message: `Promotional code ${couponCode} was removed.`,
        type: 'success',
        icon: 'check',
        persist: false,
        title: 'Coupon'});
    };

    return {
      handleAddCoupon,
      handleRemoveCoupon,
      promosApplied,
      promoCode,
      loading
    };
  }
});
</script>

<style lang="scss" scoped>
.property {
  margin-bottom: var(--spacer-xs);
}
.applied-coupon {
  &__code {
    font-weight: bold;
    color: var(--c-primary);
  }
}
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-xl) var(--spacer-xl) 0;

  &:last-child {
    padding-bottom: var(--spacer-xl);
  }

  .promo-code {
    &__input {
     --input-background: var(--c-white);
    }
  }
}

.promo-code {
  display: flex;
  align-items: flex-start;

  &__button {
    --button-width: 6.3125rem;
    --button-height: var(--spacer-lg);
  }

  &__input {
    --input-background: var(--c-light);
    --input-border-color: var(--c-light);
    flex: 1;
  }
}
</style>
