<template>
  <div class="form__radio-group shipping__types">
    <div v-for="type in Object.keys(fulfillmentMethodsByType)"
    :key="type"
    class="shipping__type">
    <SfRadio
      :selected="selected.fulfillmentMethodType"
      :value="type"
      :label="$t(`${type}_Label`)"
      name="shippingMethodType"
      @change="(type) => updateShippingMethod(fulfillmentMethodsByType[type][0].shippingProviderId)"
      class="form__radio" />

    <div v-if="selected.fulfillmentMethodType === type">
      <SfComponentSelect
        data-testid="shipping-method"
        name="shippingMethod"
        :label="$t('Shipping Method')"
        :selected="selected.shippingProviderId"
        @change="updateShippingMethod"
        class="sf-component-select--underlined shipping__methods">
        <SfComponentSelectOption
            v-for="(item, index) in fulfillmentMethodsByType[type]"
            :key="index"
            :value="item.shippingProviderId">
              <div class="shipping__label">
                <div>
                  {{ th.getTranslation(item.displayName) || item.name }}
                </div>
                <div class="shipping__label-price">{{$n(Number(item.cost), 'currency')}}</div>
              </div>
          </SfComponentSelectOption>
      </SfComponentSelect>
    </div>
  </div>
  <div v-if="selected.expectedDeliveryDate">
    <small>Estimated shipping time {{((new Date(selected.expectedDeliveryDate) - Date.now())/ (1000 * 60 * 60 * 24)).toFixed() }} days</small>
  </div>
</div>
</template>

<script>
import { SfButton, SfRadio, SfComponentSelect } from '@storefront-ui/vue';
import { useUiHelpers } from '~/composables';

export default {
  name: 'VsfShippingProvider',
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    selected: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fulfillmentMethodsByType: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    SfButton,
    SfRadio,
    SfComponentSelect
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
    }
  }
}
.shipping {

  &__types {
    display: flex;
   flex-wrap: wrap;
   justify-content: flex-start;
   margin-bottom: var(--spacer-base);
  }
  &__type {
    flex: 1 1 100%;
    @include for-desktop {
      flex: 0 0 50%;
    }
  }
  &__methods {
    margin-top: var(--spacer-base);
  }
  &__label {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
