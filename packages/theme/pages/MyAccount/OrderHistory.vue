<template>
  <div v-if="isOrderSelected">
    <SfButton class="sf-button--text all-orders" @click="isOrderSelected = false">All Orders</SfButton>
    <div class="highlighted highlighted--total">
      <SfProperty
        name="Order Number"
        :value="orderGetters.getNumber(currentOrder)"
        class="sf-property property"
      />
      <SfProperty
        name="Date"
        :value="orderGetters.getDate(currentOrder)"
        class="sf-property property"
      />
      <SfProperty
        name="Status"
        :value="getOrderStatusLookup(currentOrder)"
        class="sf-property property"
      />
      <SfProperty
        name="Total"
        :value="$n(orderGetters.getPrice(currentOrder), 'currency')"
        class="sf-property property"
      />
    </div>
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
      <SfTableRow v-for="(item, i) in orderGetters.getProducts(currentOrder)" :key="i" class="table__row">
       <SfTableData class="table__image">
          <SfImage
            :src="addBasePath(orderGetters.getProductImage(item))"
            :alt="orderGetters.getProductName(item)"
            data-testid="product-image-table-data"
          />
        </SfTableData>
        <SfTableData class="table__description">
          <nuxt-link :to="localePath(orderGetters.getProductLink(item))">
            {{orderGetters.getProductName(item)}}
          </nuxt-link>
        </SfTableData>
        <SfTableData class="table__data">
          <SfPrice
            class="product-price"
            :regular="orderGetters.getProductPrice(item).regular && $n(orderGetters.getProductPrice(item).regular, 'currency')"
            :special="orderGetters.getProductPrice(item).special && $n(orderGetters.getProductPrice(item).special, 'currency')"
          />
        </SfTableData>
        <SfTableData class="table__data">{{orderGetters.getProductQty(item)}}</SfTableData>
        <SfTableData class="table__data">{{$n(orderGetters.getProductTotal(item), 'currency')}}</SfTableData>
      </SfTableRow>
    </SfTable>
    <div class="highlighted highlighted--total">
      <SfHeading
        :title="$t('Shipping')"
        :level="3"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <SfProperty
        name="Shipping method"
        :value="th.getTranslation(orderGetters.getFulfillmentMethodName(currentOrder))"
        class="sf-property property"
      />
      <SfProperty
        name="Status"
        :value="getShipmentStatusLookup(currentOrder)"
        class="sf-property property"
      />
      <SfProperty
        name="Shiping address"
        class="sf-property">
        <template #value>
          <AddressPreview :address="orderGetters.getShippingAddress(currentOrder)" />
        </template>
      </SfProperty>
    </div>
    <div class="highlighted highlighted--total">
      <SfHeading
        :title="$t('Payment')"
        :level="3"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <SfProperty
        name="Payment method"
        :value="orderGetters.getPaymentMethod(currentOrder)"
        class="sf-property property"
      />
      <SfProperty
        name="Billing address"
        class="sf-property">
        <template #value>
          <AddressPreview :address="orderGetters.getPaymentAddress(currentOrder)" />
        </template>
      </SfProperty>
    </div>
    <div class="highlighted highlighted--total" v-if="orderGetters.getSubTotal(currentOrder) !== 0">
      <SfHeading
        :title="$t('Order Summary')"
        :level="3"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <SfProperty
        name="Subtotal"
        :value="$n(orderGetters.getSubTotal(currentOrder), 'currency')"
        class="sf-property property"
      />
      <div v-for="tax in orderGetters.getTaxes(currentOrder)">
        <SfProperty
          :name="th.getTranslation(orderGetters.getTaxName(tax))"
          :value="$n(orderGetters.getTaxTotal(tax), 'currency')"
          class="sf-property property"
        />
      </div>
      <SfProperty
        :name="$t('Shipping')"
        :value="$n(orderGetters.getShippingPrice(currentOrder), 'currency')"
        class="sf-property property"
      />
      <SfProperty
        name="Total"
        :value="$n(orderGetters.getTotal(currentOrder), 'currency')"
        class="sf-property property"
      />
      <SfProperty
            v-if="hasDiscounts"
            :name="$t('Total savings')"
            :value="$n(getTotalDiscountsAmount(currentOrder), 'currency')"
            class="sf-property property"
          />
    </div>
  </div>
  <div v-else>
    <div v-if="totalOrders === 0" class="no-orders">
      <p class="no-orders__title">{{ $t('You currently have no orders') }}</p>
      <SfButton class="no-orders__button">{{ $t('Start shopping') }}</SfButton>
    </div>
    <div v-else>
    <SfTabs
      key="order-history"
      :open-tab="1"
      class="tab-orphan"
    >
      <SfTab
        :title="`My  orders (${totalOrders})`">
        <SfTable class="orders">
          <SfTableHeading>
            <SfTableHeader
              v-for="historyTableHeader in historyTableHeaders"
              :key="historyTableHeader"
            >{{ historyTableHeader }}</SfTableHeader>
            <SfTableHeader class="orders__element--right" />
          </SfTableHeading>
          <SfTableRow v-for="order in orders" :key="ordersHistoryGetters.getId(order)">
            <SfTableData v-e2e="'order-number'">{{ ordersHistoryGetters.getNumber(order) }}</SfTableData>
            <SfTableData>{{ ordersHistoryGetters.getDate(order) }}</SfTableData>
            <SfTableData>{{ $n(ordersHistoryGetters.getPrice(order), 'currency') }}</SfTableData>
            <SfTableData>
              <span :class="getStatusTextClass(order)">{{ getOrderStatusLookup(order) }}</span>
            </SfTableData>
            <SfTableData class="orders__view orders__element--right">
              <SfButton class="sf-button--text desktop-only" @click="getOrderDetails(order)">
                {{ $t('View details') }}
              </SfButton>
            </SfTableData>
          </SfTableRow>
        </SfTable>
        <LazyHydrate on-interaction>
          <SfPagination
            v-if="!loading"
            class="orders__pagination"
            v-show="pagination.totalPages > 1"
            :current="pagination.currentPage"
            :total="pagination.totalPages"
            :visible="5"
          />
        </LazyHydrate>
        <div
          v-show="pagination.totalPages > 1"
          class="products__show-on-page">
          <span class="products__show-on-page__label">{{ $t('Show on page') }}</span>
          <LazyHydrate on-interaction>
            <SfSelect
              :value="pagination && pagination.itemsPerPage ? pagination.itemsPerPage.toString() : ''"
              class="products__items-per-page"
              @input="th.changeItemsPerPage"
            >
              <SfSelectOption
                v-for="option in pagination.pageOptions"
                :key="option"
                :value="option"
                class="products__items-per-page__option"
              >
                {{ option }}
              </SfSelectOption>
            </SfSelect>
          </LazyHydrate>
        </div>
       </Sftab>
      </Sftabs> 
    </div>
  </div>
</template>

<script>
import {
  SfTabs,
  SfTable,
  SfButton,
  SfProperty,
  SfLink,
  SfHeading,
  SfImage,
  SfPrice,
  SfPagination,
  SfSelect  
} from '@storefront-ui/vue';
import AddressPreview from '../../components/AddressPreview';
import { computed, ref } from '@nuxtjs/composition-api';
import { useUserOrder, ordersHistoryGetters, orderGetters, useMetadata, metadataGetters, useOrder, cartGetters } from '@vue-storefront/orc-vsf';
import { useUiHelpers } from '~/composables';
import { useRouter } from '@nuxtjs/composition-api';
import { addBasePath } from '@vue-storefront/core';
import { onSSR } from '@vue-storefront/core';
import LazyHydrate from 'vue-lazy-hydration';
export default {
  name: 'OrdersHistory',
  components: {
    SfTabs,
    SfTable,
    SfButton,
    SfProperty,
    SfLink,
    AddressPreview,
    SfHeading,
    SfImage,
    SfPrice,
    SfPagination,
    LazyHydrate,
    SfSelect
  },
  setup() {
    const th = useUiHelpers();
    const { orders: orderHistory, search, loading } = useUserOrder('order-history');
    const { response: orderByNumber, find: getOrderByNumber } = useOrder();
    const { response: metadata } = useMetadata();
    const router = useRouter();
    const { locale } = router.app.$i18n;
    const isOrderSelected = ref(false);
    const facetsFromUrl = th.getFacetsFromURL();

    onSSR(async () => {
      await search({ page: facetsFromUrl.page, itemsPerPage: facetsFromUrl.itemsPerPage, filterMember: 'OrderStatus', filterValues: ['PendingProcess', 'InProgress', 'PartiallyFulfilled', 'New', 'Completed', 'Canceled', 'Shipped'] });
    });    

    const getStatusTextClass = (order) => {
      const status = ordersHistoryGetters.getStatus(order);
      switch (status) {
        case 'InProgress':
          return 'text-warning';
        case 'Completed':
          return 'text-success';
        case 'Canceled':
          return 'text-danger';
        default:
          return 'text-info';
     }
   };
    const getLookupValue = (lookupName, value) => {
      return metadataGetters.getLookupValueDisplayName(metadata?.value, lookupName , value, locale);
    }
    const getOrderDetails = async (order) => {      
      await getOrderByNumber({orderNumber: ordersHistoryGetters.getNumber(order)});
      isOrderSelected.value = true;
    }
    const getOrderStatusLookup = (order) => {
      return getLookupValue('OrderStatus', orderGetters.getStatus(order));
    }
    const getShipmentStatusLookup = (order) => {
      return getLookupValue('ShipmentStatus', orderGetters.getShipmentStatus(order));
    }    
    const pagination = computed(() => ordersHistoryGetters.getPagination(orderHistory.value, facetsFromUrl.itemsPerPage, facetsFromUrl.page ));

    const getTotalDiscountsAmount = (order) => {
      const cart = orderGetters.getCart(order);
      const itemsDiscountsAmount = cartGetters.getItemsDiscountsAmount(cart);
      const totals = cartGetters.getTotals(cart);
      return totals.value?.discount + itemsDiscountsAmount.value;
    }
    return {
      orders: computed(() => ordersHistoryGetters.getOrdersHistory(orderHistory?.value)),
      totalOrders: computed(() => ordersHistoryGetters.getOrdersTotal(orderHistory?.value)),
      getStatusTextClass,
      orderGetters,
      ordersHistoryGetters,
      currentOrder: computed(() => orderByNumber?.value),
      getOrderDetails,
      isOrderSelected,
      th,
      getOrderStatusLookup,
      addBasePath,
      getShipmentStatusLookup,
      tableHeaders: ['Description', 'Unit Price', 'Quantity', 'Subtotal'],
      historyTableHeaders: ['Order Number', 'Date', 'Total', 'Status'],
      pagination,
      loading,
      getTotalDiscountsAmount
    };
  }
};
</script>

<style lang='scss' scoped>
img.sf-image.sf-image-loaded{
  max-height: 100px !important;
}
.no-orders {
  &__title {
    margin: 0 0 var(--spacer-lg) 0;
    font: var(--font-weight--normal) var(--font-size--base) / 1.6 var(--font-family--primary);
  }
  &__button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: 17,5rem;
    }
  }
}
.orders {
  @include for-desktop {
    &__element {
      &--right {
        --table-column-flex: 1;
        text-align: right;
      }
    }
  }
}
.all-orders {
  --button-padding: var(--spacer-base) 0;
}

.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-sm);
  --property-value-font-size: var(--font-size--base);
  --property-name-font-size: var(--font-size--base);
  &:last-child {
    margin-bottom: 0;
  }
  ::v-deep .sf-property__name {
    white-space: nowrap;
  }
  &--total {
    margin-bottom: var(--spacer-sm);
  }
  @include for-desktop {
    padding: var(--spacer-xl);
    --property-name-font-size: var(--font-size--lg);
    --property-name-font-weight: var(--font-weight--medium);
    --property-value-font-size: var(--font-size--lg);
    --property-value-font-weight: var(--font-weight--semibold);
  }
}
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
  @include for-desktop {
    margin: 0 0 var(--spacer-base) 0;
    --table-heading-padding: var(--spacer-sm) 0;
    &__pagination {
    display: flex;
    justify-content: flex-start;
    margin: var(--spacer-xl) 0 0 0;
    }
    &__show-on-page {
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
      &__label {
        font-family: var(--font-family--secondary);
        font-size: var(--font-size--sm);
    }}
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
.product-price {
  --price-regular-font-size: var(--font-size--base);
  --price-regular-font-weight: var(--font-weight--normal);
  --price-special-font-weight: var(--font-weight--normal);
  --price-flex-direction: column;
  --price-align-items: center;
}
</style>
