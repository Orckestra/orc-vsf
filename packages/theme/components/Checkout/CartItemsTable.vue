<template>
  <div id="items-table">
    <SfTable class="sf-table--bordered table">
      <SfTableHeading class="table__row">
        <SfTableHeader class="table__header table__image">Item</SfTableHeader>
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="table__header"
          :class="{ table__description: tableHeader === 'Description' }"
          >{{ tableHeader }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="(product, index) in products"
        :key="index"
        :class="`table__row status-${cartGetters.getItemStatus(product)}`"
        data-testid="product-table-row"
      >
        <SfTableData class="table__image">
          <SfImage
            :src="cartGetters.getItemImage(product)"
            :alt="cartGetters.getItemName(product)"
            data-testid="product-image-table-data"
            width="200"
            height="100"
          />
        </SfTableData>

        <SfTableData
          class="table__description"
          data-testid="product-description-table-data">

          <div class="product-title">{{ cartGetters.getItemName(product) }}</div>
          <div>
             <SfProperty
                v-for="(attribute, key) in cartGetters.getItemAttributes(product, ['Colour', 'RetailSize'])"
                :key="key"
                :name="key"
                :value="metadataGetters.getLookupValueDisplayName(metadata, key, attribute, locale)"
              />
          </div>
          <SfProperty
            key="Status"
            name="Status"
            v-if="cartGetters.getItemStatus(product) === 'OutOfStock'"
            :value="cartGetters.getItemStatus(product)"
          />
        </SfTableData>

        <SfTableData class="table__data">
          <SfPrice
            class="product-price"
            :regular="cartGetters.getItemPrice(product).regular && $n(cartGetters.getItemPrice(product).regular, 'currency')"
            :special="cartGetters.getItemPrice(product).special && $n(cartGetters.getItemPrice(product).special, 'currency')"
          />
        </SfTableData>

        <SfTableData class="table__data product-qty">
          {{ cartGetters.getItemQty(product) }}
          <div>
            <SfButton class="sf-button--text product-remove"
              @click="removeItem({ product: { id: product.id } })">
              Remove Item
            </SfButton>
          </div>

        </SfTableData>

        <SfTableData class="table__data product-total">
          {{$n(cartGetters.getItemTotals(product).total, 'currency')}}
        </SfTableData>

      </SfTableRow>
    </SfTable>
  </div>
</template>
<script>
import {
  SfTable,
  SfImage,
  SfButton,
  SfPrice,
  SfProperty } from '@storefront-ui/vue';
import { computed, useRouter } from '@nuxtjs/composition-api';
import { useCart, cartGetters, useMetadata, metadataGetters } from 'orc-vsf';
import { addBasePath } from '@vue-storefront/core';

export default {
  name: 'CartItemsTable',
  components: {
    SfTable,
    SfProperty,
    SfImage,
    SfButton,
    SfPrice
  },
  setup() {
    const { cart, removeItem } = useCart();
    const router = useRouter();
    const { response: metadata } = useMetadata();
    const { locale } = router.app.$i18n;
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const products = computed(() => cartGetters.getItems(cart.value));
    const isActiveShippingTaxable = computed(() => cartGetters.isActiveShippingTaxable(cart.value));
    const isActiveShippingEstimated = computed(() => cartGetters.isActiveShippingEstimated(cart.value));
    const taxes = computed(() => cartGetters.getTaxes(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));

    return {
      addBasePath,
      cartGetters,
      cart,
      removeItem,
      products,
      totalItems,
      totals,
      taxes,
      isActiveShippingTaxable,
      isActiveShippingEstimated,
      locale,
      metadata,
      metadataGetters,
      tableHeaders: ['Description', 'Unit Price', 'Quantity', 'Subtotal']
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.title {
  --heading-padding: var(--spacer-xl) 0 var(--spacer-base);
  --heading-title-font-weight: var(--font-weight--bold);
  @include for-desktop {
    --heading-title-font-size: var(--h3-font-size);
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-padding: var(--spacer-xl) 0;
  }
}
.table {
  --table-row-padding: var(--spacer-sm) 0 var(--spacer-xs);
  :nth-of-type(4), :nth-of-type(3) {
    text-align: center;
  }
  &__header:last-child {
    text-align: right;
  }
  &__header:nth-of-type(odd),
  .sf-table__data:nth-of-type(odd) {
    padding-bottom: var(--spacer-sm);
  }
  &__row {
    justify-content: space-between;
    --property-name-font-size: var(--font-size--sm);
    --property-value-font-size: var(--font-size--sm);
    &.status-OutOfStock {
      --table-row-border-width: 2px;
      --table-row-border-color: red;
    }
  }
  &__data:nth-of-type(4), &__data:nth-of-type(3) {
    text-align: center;
  }
  &__data:last-child {
      text-align: right;
  }
  &__image {
    --image-width: 2.75rem;
    text-align: left;
  }
  @include for-desktop {
    margin: 0 0 var(--spacer-base) 0;
    --table-heading-padding: var(--spacer-sm) 0;
    &__header {
      &:last-of-type {
        margin-right: var(--spacer-xs);
      }
      &:nth-of-type(4), &:nth-of-type(3) {
        text-align: center;
      }
      &__description {
        order: -1;
      }
    }
    &__header:nth-of-type(odd),
    .sf-table__data:nth-of-type(odd) {
      padding-bottom: 0;
    }
    &__data {
      &:nth-of-type(4), &:nth-of-type(3) {
        text-align: center;
      }
      &:last-of-type {
        margin-right: var(--spacer-xs);
      }
    }
    &__description {
      text-align: left;
      flex: 0 0 15rem;
      order: -1;
    }
    &__image {
      --image-width: 5.125rem;
      order: -1;
      text-align: center;
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}
.product-sku {
  font-family: var(--font-family--primary);
  color: var(--c-text-muted);
  @include for-desktop {
    margin-top: var(--spacer-sm);
  }
}
.product-qty {
 text-align: center;
}
.product-price {
  --price-regular-font-size: var(--font-size--base);
  --price-regular-font-weight: var(--font-weight--normal);
  --price-special-font-weight: var(--font-weight--normal);
  --price-flex-direction: column;
  --price-align-items: center;
}

.product-remove {
  margin-top: var(--spacer-base);
}

.product-total {
  text-align: center;
}
</style>
