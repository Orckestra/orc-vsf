<template>
  <div class="form__radio-group" data-testid="pickup-location">
  <div class="stores">
    <SfRadio 
        v-for="(item, index) in stores" class="form__radio store" :key="index"
      :selected="selected"
      :label="th.getTranslation(item.displayName) || item.name"
      :value="item.id"
      name="storeSelector"
      :description="item.fulfillmentLocation.addresses[0].city"
      @input="updateSelectedStoreForPickup"
    >
      <template #label="{ label }">
        <div class="sf-radio__label pickupLocation__label">
          <span><b>{{ label }}</b></span>
        </div>
      </template>
      <template #description>
        <AddressPreview :address="item.fulfillmentLocation.addresses[0]" :showName="false" :showAddressName="false" :showPhone="false"/>
      </template>
    </SfRadio>
    </div>
  </div>
  
</template>

<script>
import { SfButton, SfRadio, SfScrollable } from '@storefront-ui/vue';
import { useUiHelpers } from '~/composables';
import AddressPreview from '~/components/AddressPreview';

export default {
  name: 'VsfStoresList',
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    selected: {
      type: String,
      default: ''
    },
    stores: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SfButton,
    SfRadio,
    AddressPreview,
    SfScrollable
  },
  emits: ['change'],
  setup(props, { emit }) {
    const th = useUiHelpers();
    const updateSelectedStoreForPickup = value => emit('change', value);

    return {
      th,
      updateSelectedStoreForPickup
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
}

.stores {
   display: flex;
   flex-wrap: wrap;
   justify-content: flex-start;
}

.store {
    flex: 1 1 100%;
    @include for-desktop {
      flex: 0 1 25%;
    }
}
</style>
