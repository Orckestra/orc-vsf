<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <SfHeading
      v-e2e="'shipping-heading'"
      :level="3"
      :title="$t('Shipping method')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <VsfShippingProvider
        :fulfillmentMethods="fulfillmentMethods"
        :selected="form.shippingMethod"
        @change="updateShippingMethod"
      />
      <template v-if="isShippingMethod">
        <SfHeading
          :level="4"
          :title="'Shipping address'"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <template v-if="isAuthenticated">

          <AddressSelector
            :addresses="addresses"
            :selected="shipmentAddressId"
            @input="updateAddress" />

          <template v-if="isOpen.addingAddress">
            <SfHeading
              :level="4"
              :title="'Add shipping address'"
              class="sf-heading--left sf-heading--no-underline title"
            />
            <ValidationObserver v-slot="{ handleSubmit: hS }">
              <form
                class="form"
                @submit.prevent="hS(saveAddress)"
              >
                <AddressForm :form="addressForm" />
                <div class="form__action-bar">
                  <SfButton
                    type="button"
                    class="form__action-button--secondary color-light sf-button"
                    @click="cancelEditing">
                      {{ $t('Cancel') }}
                  </SfButton>
                  <SfButton
                    class="sf-button sf-button-primary"
                    :disabled="loadingFulfillmentMethods || loadingAddresses"
                  >
                    Save new address
                  </SfButton>

                </div>
              </form>
            </ValidationObserver>
          </template>
          <template v-else>
            <SfButton
              class="sf-button form__action-button--add-address sf-button--pure"
              :disabled="loadingFulfillmentMethods || loadingAddresses || loadingCart"
              type="button"
              @click="addNewAddress"
            >
              <SfIcon
                icon="plus"
                size="sm"
                color="green-primary"
                viewBox="0 0 24 24"
                :coverage="1"
              /> <span>Add a new address</span>
            </SfButton>
          </template>
        </template>
        <template v-else>
          <AddressForm
            :form="addressForm"
            :showName="false"
          />
        </template>
      </template>
      <template v-if="isPickupMethod && isOpen.choosePickUpLocation">
      
        <SfHeading
          :level="4"
          :title="'Select PickUp location'"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <VsfStoresList
        :stores="stores"
        :selected="form.pickUpLocationId"
        @change="updateSelectedStoreForPickup"
      />
      
      </template>
       <template v-if="isPickupMethod && !isOpen.choosePickUpLocation">
         <SfHeading
          :level="4"
          :title="'Selected PickUp location'"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <div >
        <span><b>{{form.selectedStore.name}}</b></span>
              <br/>
              <AddressPreview :address="form.selectedStoreAddress" :showAddressName="false" :showName="false"/>
        </div>
        <br/>
          <button
              type="link"
              @click="changeSelectedPickupLocation"
            >
            Change Selected PickUp Location 
            </button>
            <br/>
      </template>
      <div class="form">
        <div class="form__action-bar">
          <SfButton
            class="form__action-button--secondary sf-button color-secondary form__back-button"
            type="button"
            @click="goBack"
          >
            {{ $t('Go back') }}
          </SfButton>
          <SfButton
            :disabled="loadingFulfillmentMethods || loadingAddresses || loadingCart || (isAuthenticated && isShippingMethod && !shipmentAddressId) || !form.shippingMethod"
            class="form__action-button"
            type="submit"
          >
            {{ $t('Go to billing') }}
          </SfButton>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfButton,
  SfIcon
} from '@storefront-ui/vue';
import { computed, ref, useRouter, watch } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';
import { onSSR } from '@vue-storefront/core';
import { useUser, useFulfillmentMethods, useUserAddresses, storesGetters, useStores, useCart, cartGetters, fulfillmentMethodsGetters, userAddressGetters } from '@vue-storefront/orc-vsf';
import { required, min, digits } from 'vee-validate/dist/rules';
import { ValidationObserver, extend } from 'vee-validate';
import AddressForm from '~/components/AddressForm';
import AddressPreview from '~/components/AddressPreview';
import AddressSelector from '~/components/AddressSelector';
import VsfShippingProvider from '../../components/Checkout/VsfShippingProvider';
import VsfStoresList from '../../components/Checkout/VsfStoresList';
import { FulfillmentMethodType } from '@vue-storefront/orc-vsf-api/src';

extend('required', {
  ...required,
  message: 'This field is required'
});
extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});
extend('digits', {
  ...digits,
  message: 'Please provide a valid phone number'
});

export default {
  name: 'Shipping',
  components: {
    SfHeading,
    SfButton,
    SfIcon,
    ValidationObserver,
    AddressForm,
    AddressSelector,
    AddressPreview,
    VsfShippingProvider,
    VsfStoresList
  },
  setup (props, context) {
    const router = useRouter();
    const { send: sendNotification } = useUiNotification();
    const { cart, update, error, loading: loadingCart } = useCart();
    const { addresses, load: loadUserShipping, addAddress, loading: loadingAddresses, error: userAddressError } = useUserAddresses();
    const { load: loadFulfillmentMethods, fulfillmentMethods, loading: loadingFulfillmentMethods } = useFulfillmentMethods();
    const { isAuthenticated } = useUser();
    const { stores: storesList, search: loadStoresList } = useStores();

    const shipment = computed(() => cartGetters.getActiveShipment(cart.value));
    const shipmentAddressId = computed(() => shipment.value?.address?.id);

    const stores = computed(() => storesGetters.getStores(storesList.value));

    const form = ref({
      shippingMethod: shipment.value?.fulfillmentMethod?.shippingProviderId,
      pickUpLocationId: null,
      selectedStore: null,
      selectedStoreAddress: null
    });

    const resetForm = (address) => ({
      addressName: address?.addressName || '',
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      line1: address?.line1 || '',
      line2: address?.line2 || '',
      city: address?.city || '',
      regionCode: address?.regionCode || '',
      postalCode: address?.postalCode || '',
      countryCode: address?.countryCode || '',
      phoneNumber: address?.phoneNumber || ''
    });
    const addressForm = ref(resetForm(shipment.value?.address));

    const isShippingMethod = computed(() => fulfillmentMethodsGetters.getFulfillmentMethodType(fulfillmentMethods.value, form.value.shippingMethod) === 'Shipping');
    const isPickupMethod = computed(() => fulfillmentMethodsGetters.getFulfillmentMethodType(fulfillmentMethods.value, form.value.shippingMethod) === 'PickUp');

    const isOpen = ref({ addingAddress: false, choosePickUpLocation: !form.value.pickUpLocationId });

    const addNewAddress = () => {
      addressForm.value = resetForm();
      isOpen.value.addingAddress = true;
    };

    const cancelEditing = () => {
      isOpen.value.addingAddress = false;
    };

    const onUpdate = async (updatedShipment, onComplete) => {
      const updatedCart = {
        ...cart.value,
        shipments: cart.value.shipments.map(x => x.id === shipment.value.id ? updatedShipment : x)
      };

      if (!cart.value.shipments?.length) return;
      await update({ cart: updatedCart });

      if (error.value.update) {
        sendNotification({
          id: Symbol('user_updated_error'),
          message: error.value.update.message,
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'Checkout process'
        });
      } else {
        onComplete();
      }
    };

    const updateCartAddress = (address) => {
      isOpen.value.addingAddress = false;
      onUpdate({ ...shipment.value, address }, () => {});
    };

    const saveAddress = async () => {
      try {
        const address = addressForm.value;

        if (!addresses.value || addresses.value.length === 0) {
          address.isPreferredBilling = true;
          address.isPreferredShipping = true;
        }
        await addAddress({ address });

        if (userAddressError.value.addAddress) {
          sendNotification({
            id: Symbol('user_updated_error'),
            message: userAddressError.value.addAddress.message,
            type: 'danger',
            icon: 'error',
            persist: false,
            title: 'User Address'
          });
        } else {
          const address = addresses.value.find(x => x.addressName === addressForm.value.addressName);
          if (address) {
            updateCartAddress(address);
          }

          sendNotification({
            id: Symbol('user_updated'),
            message: 'The user address was successfully added!',
            type: 'success',
            icon: 'check',
            persist: false,
            title: 'User Address'
          });
        }

      } catch (error) {
        console.error(error);
      }
    };

    const updateSelectedStoreForPickup = (value) => {
      form.value.pickUpLocationId = value;
      const selectedStore = stores.value.find(x => x.id === value);
      form.value.selectedStore = selectedStore;
      form.value.selectedStoreAddress = selectedStore.fulfillmentLocation.addresses[0];
       const updatedShipment = {
        ...shipment.value,
        pickUpLocationId: value,
        address: selectedStore.fulfillmentLocation.addresses[0],
        fulfillmentLocationId: selectedStore.fulfillmentLocation.id
       }

      isOpen.value.choosePickUpLocation = false;
      onUpdate(updatedShipment, () => {});
    }


    const changeSelectedPickupLocation = () => {
      isOpen.value.choosePickUpLocation = true;
      onUpdate(shipment.value, () => {});
    }


    const updateShippingMethod = (value) => {
      form.value.shippingMethod = value;
      const updatedShipment = {
        ...shipment.value,
        fulfillmentMethod: fulfillmentMethods.value.find(x => x.shippingProviderId === value)
        // if PickUpLocationId
        // pickUpLocationId: null,
        // address: null,
        // fulfillmentLocationId = fulfillmentLocation.Id;
      };

      if (isAuthenticated.value && !shipment.value?.address?.id && updatedShipment.fulfillmentMethod.fulfillmentMethodType === FulfillmentMethodType.Shipping) {
        const preferredAddress = userAddressGetters.getDefaultShipping(addresses.value);

        form.value.addressId = preferredAddress?.id;
        updatedShipment.address = preferredAddress;
      }

      
      isOpen.value.choosePickUpLocation = false;

      onUpdate(updatedShipment, () => {});
    };

    const updateAddress = (value) => updateCartAddress(addresses.value.find(x => x.id === value));

    const handleFormSubmit = () => {
      if (isShippingMethod.value && !isAuthenticated.value) {
        const updatedShipment = {
          ...shipment.value
        };
        updatedShipment.address = addressForm.value;
        onUpdate(updatedShipment, () => router.push(context.root.localePath({ name: 'payment' })));
      } else if(isPickupMethod.value) {
        onUpdate(shipment.value, () => router.push(context.root.localePath({ name: 'payment' })));
      } 
      else {
        router.push(context.root.localePath({ name: 'billing' }));
      }
    };

    onSSR(async () => Promise.allSettled([
      loadUserShipping(),
      loadFulfillmentMethods(),
      loadStoresList()
    ]));

    watch(isAuthenticated, () => {
      if (isAuthenticated.value) {
        loadUserShipping();
      }
    });

    const goBack = () => {
      router.push(context.root.localePath({ name: 'personalDetails' }));
    };

    return {
      router,
      loadingFulfillmentMethods,
      loadingAddresses,
      loadingCart,
      isShippingMethod,
      isOpen,
      form,
      addressForm,
      isAuthenticated,
      addNewAddress,
      cancelEditing,
      saveAddress,
      handleFormSubmit,
      updateShippingMethod,
      updateAddress,
      goBack,
      fulfillmentMethods,
      addresses,
      fulfillmentMethodsGetters,
      shipmentAddressId,
      stores,
      isPickupMethod,
      updateSelectedStoreForPickup,
      changeSelectedPickupLocation

    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  --button-width: 100%;

  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    --button-width: auto;
  }

  &__action-bar {
    margin-bottom: var(--spacer-xl);
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }

  &__action-button {
      margin: 0;
      width: 100%;
      margin: var(--spacer-sm) 0 0 0;
      @include for-desktop {
        margin: 0 var(--spacer-xl) 0 0;
        width: auto;
      }
      &--secondary {
        margin: 0 0 var(--spacer-sm) 0;
        @include for-desktop {
          order: -1;
          text-align: left;
          margin: 0 var(--spacer-xl) 0 0;
        }
      }

      &--add-address {
        width: 100%;
        margin: var(--spacer-sm) 0 var(--spacer-xl) 0;
        @include for-desktop {
          width: auto;
        }
      }
      &__back-button {
        margin: var(--spacer-xl) 0 var(--spacer-sm);
        &:hover {
          color:  var(--c-white);
        }
        @include for-desktop {
          margin: 0 var(--spacer-xl) 0 0;
        }
    }
  }
}

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
</style>
