<template>
  <SfTabs :open-tab="1">
    <SfTab title="My сurrent orders">
      <div v-if="isOrderSelected">
        <SfButton class="sf-button--text all-orders" @click="isOrderSelected = false">All Orders</SfButton>
        <div class="highlighted highlighted--total">
          <SfProperty
            name="Order Number"
            :value="orderGetters.getId(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            name="Date"
            :value="orderGetters.getDate(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            name="Status"
            :value="orderGetters.getStatus(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            name="Total"
            :value="$n(orderGetters.getPrice(currentOrder), 'currency')"
            class="sf-property--full-width property"
          />
        </div>
        <SfTable class="products">
          <SfTableHeading>
            <SfTableHeader class="products__name">{{ $t('Product') }}</SfTableHeader>
            <SfTableHeader>{{ $t('Quantity') }}</SfTableHeader>
            <SfTableHeader>{{ $t('Price') }}</SfTableHeader>
          </SfTableHeading>
          <SfTableRow v-for="(item, i) in orderGetters.getProducts(currentOrder)" :key="i">
            <SfTableData class="products__name">
              <nuxt-link :to="'/p/'+orderGetters.getProductSku(item)">
                {{orderGetters.getProductName(item)}}
              </nuxt-link>
            </SfTableData>
            <SfTableData>{{orderGetters.getProductQty(item)}}</SfTableData>
            <SfTableData>{{$n(orderGetters.getProductPrice(item), 'currency')}}</SfTableData>
          </SfTableRow>
        </SfTable>
        <div class="highlighted highlighted--total">
          <SfHeading
            title="Shipping"
            :level="3"
            class="sf-heading--left sf-heading--no-underline title"
          />
          <p class="message">
            {{ orderGetters.getFulfillmentMethodName(currentOrder) }}
          </p>

            <AddressPreview :address="orderGetters.getShippingAddress(currentOrder)" />
        </div>
        <div class="highlighted highlighted--total">
          <SfHeading
            title="Payment"
            :level="3"
            class="sf-heading--left sf-heading--no-underline title"
          />
          <p class="message">
            {{ orderGetters.getPaymentMethod(currentOrder) }}
          </p>
            <AddressPreview :address="orderGetters.getPaymentAddress(currentOrder)" />
        </div>
        <div class="highlighted highlighted--total">
          <SfHeading
            title="Order Summary"
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
            :name="orderGetters.getTaxName(tax, locale)"
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
        <p class="message">
          {{ $t('Check the details and status of your orders in the online store. You can also cancel your order or request a return.') }}
        </p>
        <div v-if="totalOrders === 0" class="no-orders">
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
              <span :class="getStatusTextClass(order)">{{ ordersHistoryGetters.getStatus(order) }}</span>
            </SfTableData>
            <SfTableData class="orders__view orders__element--right">
              <SfButton class="sf-button--text desktop-only" @click="getOrderDetails(order)">
                {{ $t('View details') }}
              </SfButton>
            </SfTableData>
          </SfTableRow>
        </SfTable>
        <p>Total orders - {{ totalOrdersCurrent }}</p>
      </div>
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
              <span :class="getStatusTextClass(pastOrder)">{{ ordersHistoryGetters.getStatus(pastOrder) }}</span>
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
</template>

<script>
import {
  SfTabs,
  SfTable,
  SfButton,
  SfProperty,
  SfLink,
  SfHeading
} from '@storefront-ui/vue';
import AddressPreview from '../../components/AddressPreview';
import { computed, ref } from '@nuxtjs/composition-api';
import { useOrdersHistory, ordersHistoryGetters, orderGetters, useOrder, useRouter } from '@vue-storefront/orc-vsf';
import { AgnosticOrderStatus } from '@vue-storefront/core';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'PersonalDetails',
  components: {
    SfTabs,
    SfTable,
    SfButton,
    SfProperty,
    SfLink,
    AddressPreview
  },
  setup() {
    const { response: orderHistoryCurrent, load: loadOrdersHistoryCurrent } = useOrdersHistory('order-history-current');
    const { response: orderHistoryPast, load: loadOrdersHistoryPast } = useOrdersHistory('order-history-past');
    const { response: orderByNumber, find: getOrderByNumber } = useOrder();
    const currentOrder = ref(null);
    const router = useRouter();
    const { locale } = router.app.$i18n;
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
      locale
    };
  }
};
</script>

<style lang='scss' scoped>
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
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6 var(--font-family--primary);
  &__link {
    color: var(--c-primary);
    font-weight: var(--font-weight--medium);
    font-family: var(--font-family--primary);
    font-size: var(--font-size--base);
    text-decoration: none;
    &:hover {
      color: var(--c-text);
    }
  }
}
.product {
  &__properties {
    margin: var(--spacer-xl) 0 0 0;
  }
  &__property,
  &__action {
    font-size: var(--font-size--sm);
  }
  &__action {
    color: var(--c-gray-variant);
    font-size: var(--font-size--sm);
    margin: 0 0 var(--spacer-sm) 0;
    &:last-child {
      margin: 0;
    }
  }
  &__qty {
    color: var(--c-text);
  }
}
.products {
  --table-column-flex: 1;
  &__name {
    margin-right: var(--spacer-sm);
    @include for-desktop {
      --table-column-flex: 2;
    }
  }
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
  ::v-deep .sf-property__value {
    text-align: right;
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

</style>
