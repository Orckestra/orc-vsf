<template v-if="addresses">
  <div class="address-selector" >
    <SfRadio
      v-for="item in addresses"
      :key="item.id"
      :selected="selected"
      :label="item.addressName"
      :value="item.id"
      name="addressSelector"
      @change="changeHandler"
      @input="inputHandler"
      class="address-selector__radio">

      <template #label="{ label }">
        <div class="sf-radio__label address-selector__label">
          <div>
            {{ label }}
          </div>
          <SfButton
            class="sf-button--text"
            :class="{ 'action--is-active': isOpen[item.id] }"
            type="button"
            @click="(isOpen = { ...isOpen, [item.id]: !isOpen[item.id] })"
          >
            <SfIcon
              icon="more"
              size="22px"
              color="black"
            />
          </SfButton>
        </div>
      </template>

      <template  #description>
        <div class="sf-radio__description address-selector__description">
          <transition name="sf-fade">
            <div v-if="isOpen[item.id]" class="address-selector__info">
              <AddressPreview :address="item" :showName="false"/>
            </div>
          </transition>
        </div>
      </template>
   </SfRadio>
  </div>
</template>

<script>
import { SfButton, SfRadio, SfIcon } from '@storefront-ui/vue';
import AddressPreview from '~/components/AddressPreview';
import { ref } from '@nuxtjs/composition-api';
export default {
  name: 'AddressSelector',
  components: {
    SfButton,
    SfRadio,
    SfIcon,
    AddressPreview
  },
  props: {
    addresses: {
      type: Array,
      default: null
    },
    selected: {
      type: String,
      default: null
    }
  },
  methods: {
    changeHandler(value) {
      this.$emit('change', value);
    },
    inputHandler(value) {
      this.$emit('input', value);
    }
  },
  setup() {
    const isOpen = ref({});
    return {
      isOpen
    };
  }
};
</script>
<style lang='scss' scoped>
.address-selector {
    &__radio-group {
      flex: 0 0 calc(100% + var(--spacer-sm));
      margin: 0 calc(-1 * var(--spacer-sm));
    }

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
