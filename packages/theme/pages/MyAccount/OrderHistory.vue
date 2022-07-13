<template>
  <div v-if="isOrderSelected">
    <SfButton class="sf-button--text all-orders" @click="isOrderSelected = false">All Orders</SfButton>
    <div class="highlighted highlighted--total">
      <SfProperty
        name="Order Number"
        :value="orderGetters.getNumber(currentOrder)"
        class="sf-property--full-width property"
      />
      <SfProperty
        name="Date"
        :value="orderGetters.getDate(currentOrder)"
        class="sf-property--full-width property"
      />
      <SfProperty
        name="Status"
        :value="getOrderStatusLookup(currentOrder)" 
        class="sf-property--full-width property"
      />
      <SfProperty
        name="Total"
        :value="$n(orderGetters.getPrice(currentOrder), 'currency')"
        class="sf-property--full-width property"
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
        class="sf-property--full-width property"
      />
      <SfProperty
        name="Status"
        :value="getShipmentStatusLookup(currentOrder)"
        class="sf-property--full-width property"
      />
      <SfProperty
        name="Shiping address"
        class="sf-property--full-width">
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
        class="sf-property--full-width property"
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
        :value="orderGetters.getSubTotal(currentOrder)"
        class="sf-property--full-width property"
      />
      <div v-for="tax in orderGetters.getTaxes(currentOrder)">
        <SfProperty
          :name="th.getTranslation(orderGetters.getTaxName(tax))"
          :value="orderGetters.getTaxTotal(tax)"
          class="sf-property--full-width property"
        />
      </div>
      <SfProperty
        name="Total"
        :value="orderGetters.getTotal(currentOrder)"
        class="sf-property--full-width property"
      />
      <SfProperty
        name="Saving"
        :value="$n(orderGetters.getSaving(currentOrder), 'currency')"
        class="sf-property--full-width property"
      />
    </div>
  </div>
  <div v-else>
    <SfTabs :open-tab="1">
      <SfTab title="My сurrent orders">          
        <p class="message">
          {{ $t('Check the details and status of your orders in the online store. You can also cancel your order or request a return.') }}
        </p>
        <div v-if="totalOrdersCurrent === 0" class="no-orders">
          <p class="no-orders__title">{{ $t('You currently have no orders') }}</p>
          <SfButton class="no-orders__button">{{ $t('Start shopping') }}</SfButton>
        </div>
        <SfTable v-else class="orders">
          <SfTableHeading>
            <SfTableHeader
              v-for="tableHeader in tableHeadersCurrent"
              :key="tableHeader"
            >{{ tableHeader }}</SfTableHeader>
            <SfTableHeader class="orders__element--right" />
          </SfTableHeading>
          <SfTableRow v-for="order in currentOrders" :key="ordersHistoryGetters.getId(order)">
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
        <p>Total orders - {{ totalOrdersCurrent }}</p>
      </SfTab>
      <SfTab title="My past orders">
        <div>
          <p class="message">
              {{ $t('Your Past orders') }}
          </p>
          <SfTable class="orders">
            <SfTableHeading>
              <SfTableHeader
                v-for="tableHeader in tableHeadersPast"
                :key="tableHeader"
              >{{ tableHeader }}</SfTableHeader>
              <SfTableHeader class="orders__element--right" />
            </SfTableHeading>
            <SfTableRow v-for="pastOrder in pastOrders" :key="ordersHistoryGetters.getId(pastOrder)">
              <SfTableData v-e2e="'order-number'">{{ ordersHistoryGetters.getNumber(pastOrder) }}</SfTableData>
              <SfTableData>{{ ordersHistoryGetters.getDate(pastOrder) }}</SfTableData>
              <SfTableData>
                <span :class="getStatusTextClass(pastOrder)">{{ getOrderStatusLookup(pastOrder) }}</span>
              </SfTableData>
              <SfTableData class="orders__view orders__element--right">
                <SfButton class="sf-button--text desktop-only" @click="getOrderDetails(pastOrder)">
                  {{ $t('View details') }}
                </SfButton>
              </SfTableData>
            </SfTableRow>
          </SfTable>
          <p>Total orders Past - {{ totalOrdersPast }}</p>
        </div>
      </SfTab>
    </SfTabs>
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
  SfPrice
} from '@storefront-ui/vue';
import AddressPreview from '../../components/AddressPreview';
import { computed, ref } from '@nuxtjs/composition-api';
import { useOrdersHistory, ordersHistoryGetters, orderGetters, useMetadata, metadataGetters, useOrder } from '@vue-storefront/orc-vsf';
import { useUiHelpers } from '~/composables';
import { useRouter } from '@nuxtjs/composition-api';
import { AgnosticOrderStatus, addBasePath } from '@vue-storefront/core';
import { onSSR } from '@vue-storefront/core';
export default {
  name: 'PersonalDetails',
  components: {
    SfTabs,
    SfTable,
    SfButton,
    SfProperty,
    SfLink,
    AddressPreview,
    SfHeading,
    SfImage,
    SfPrice
  },
  setup() {
    const th = useUiHelpers();
    const { response: orderHistoryCurrent, load: loadOrdersHistoryCurrent } = useOrdersHistory('order-history-current');
    const { response: orderHistoryPast, load: loadOrdersHistoryPast } = useOrdersHistory('order-history-past');
    const { response: orderByNumber, find: getOrderByNumber } = useOrder();
    const { response: metadata } = useMetadata();
    
    const router = useRouter();
    const { locale } = router.app.$i18n;
    
    const currentOrder = ref(null);
    let isOrderSelected =  ref(false);
    onSSR(async () => {
      if(!orderHistoryCurrent.value?.results){
        await loadOrdersHistoryCurrent({ orderTense: 1 });
      }
      if(!orderHistoryPast.value){
        await loadOrdersHistoryPast({ orderTense: 0 });    
      }
    });    

    
    const tableHeadersCurrent = [
      "Order Number",
      "Creation Date",
      "Order Total",
      "Order Status",
    ];

    const tableHeadersPast = [
      "Order Number",
      "Creation Date",
      "Order Status",
    ];

    const getStatusTextClass = (order) => {
      const status = ordersHistoryGetters.getStatus(order);
      switch (status) {
        case 'InProgress':
          return 'text-warning';
        case 'PendingProcess':
          return 'text-warning';
        case 'Finalised':
          return 'text-success';
        default:
          return '';
      }
    };

    const getOrderDetails = async (order) => {      
      await getOrderByNumber({orderNumber: ordersHistoryGetters.getNumber(order)});
      isOrderSelected.value = true;
    }

    const getOrderStatusLookup = (order) => {
      return getLookupValue("OrderStatus", orderGetters.getStatus(order));
    }

    const getShipmentStatusLookup = (order) => {
      return getLookupValue("ShipmentStatus", orderGetters.getShipmentStatus(order));
    }

    const getLookupValue = (lookupName, value) => {
      return metadataGetters.getLookupValueDisplayName(metadata?.value, lookupName , value, locale);
    }

    const currentOrders = computed(() => ordersHistoryGetters.getOrdersHistory(orderHistoryCurrent.value));
    const pastOrders = computed(() => ordersHistoryGetters.getOrdersHistory(orderHistoryPast.value));
    
    return {
      tableHeadersCurrent,
      tableHeadersPast,
      currentOrders,
      totalOrdersCurrent: computed(() => ordersHistoryGetters.getOrdersTotal(orderHistoryCurrent.value)),
      totalOrdersPast: computed(() => ordersHistoryGetters.getOrdersTotal(orderHistoryPast.value)),
      pastOrders,
      getStatusTextClass,
      orderGetters,
      ordersHistoryGetters,
      currentOrder: computed(() => orderByNumber.value),
      getOrderDetails,
      isOrderSelected,
      th,
      metadataGetters,
      metadata,
      locale,
      getOrderStatusLookup,
      addBasePath,
      getShipmentStatusLookup,
      tableHeaders: ['Description', 'Unit Price', 'Quantity', 'Subtotal']
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
