<template>
  <div class="form__radio-group" data-testid="shipping-method">
    <SfRadio
      v-for="(item, index) in fulfillmentMethods"
      :key="index"
      :selected="selected"
      :disabled="disabled"
      :label="th.getTranslation(item.displayName) || item.name"
      :value="item.shippingProviderId"
      name="shippingMethod"
      :description="item.fulfillmentMethodType"
      class="form__radio shipping"
      @input="updateShippingMethod"
    >
      <template #label="{ label }">
        <div class="sf-radio__label shipping__label">
          <div>
            {{ label }}
          </div>
          <div class="shipping__label-price">{{$n(Number(item.cost), 'currency')}}</div>
        </div>
      </template>
      <template #description>
        <div class="sf-radio__description shipping__description">
              <span>{{item.fulfillmentMethodType}}</span>
              <span v-if="item.expectedDeliveryDate">
                 / Estimated ship time:
                {{((new Date(item.expectedDeliveryDate) - Date.now())/ (1000 * 60 * 60 * 24)).toFixed() }} days
              </span>
        </div>
      </template>
    </SfRadio>
  </div>
</template>

<script>
import { SfButton, SfRadio } from '@storefront-ui/vue';
import { useUiHelpers } from '~/composables';

export default {
  name: 'VsfShippingProvider',
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    selected: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fulfillmentMethods: {
      type: Array,
      default: []
    }
  },
  components: {
    SfButton,
    SfRadio
  },
  emits: ['change'],
  setup(props, { emit }) {
    const th = useUiHelpers();
    const updateShippingMethod = value => emit('change', value);

    return {
      th,
      updateShippingMethod
    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  &__radio {
    margin: var(--spacer-xs) 0;

    &:last-of-type {
      margin: var(--spacer-xs) 0 var(--spacer-xl);
    }

    ::v-deep .sf-radio__container {
      --radio-container-padding: var(--spacer-xs);
      @include for-desktop {
        --radio-container-padding: var(--spacer-xs) var(--spacer-xs) var(--spacer-xs) var(--spacer-sm);
      }
    }
  }

  @include for-desktop {
    &__radio-group {
      flex: 0 0 calc(100% + var(--spacer-sm));
      margin: 0 calc(-1 * var(--spacer-sm));
    }
  }
}

.shipping {
  &__label {
    display: flex;
    justify-content: space-between;
  }
  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}
</style>
