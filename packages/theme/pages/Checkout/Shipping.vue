<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <SfHeading
        v-e2e="'shipping-heading'"
        :level="3"
        :title="$t('Available shipping services')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <VsfShippingProvider
        :fulfillmentMethodsByType="methodsByType"
        :selected="form.shippingMethod"
        :disabled="loadingCart"
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
            :disabled="loadingCart"
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
                    type="submit"
                    class="form__action-button sf-button sf-button-primary"
                    :disabled="loadingFulfillmentMethods || loadingAddresses"
                  >
                    Save new address
                  </SfButton>
                  <SfButton
                    type="button"
                    class="form__action-button--secondary color-light sf-button"
                    @click="cancelEditing">
                      {{ $t('Cancel') }}
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
     <template v-if="isPickupMethod">
        <SfHeading
          :level="3"
          :title="$t('Pickup location')"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <div v-if="selectedStore">
          <AddressPreview :address="selectedStoreAddress" :showAddressName="true" :showName="false"/>
        </div>
        <SfButton
          class="sf-button--text edit-location-button"
          @click.prevent="toggleStoresModal">
          <span v-if="selectedStore">
            {{ $t('Edit pickup location') }}
          </span>
          <span v-else>
             {{ $t('Select pickup location') }}
          </span>
        </SfButton >
      </template>
      <div class="form">
        <div class="form__action-bar">
          <SfButton
            :disabled="loadingFulfillmentMethods || loadingAddresses || loadingCart || (isAuthenticated && isShippingMethod && !shipmentAddressId) || !form.shippingMethod || (isPickupMethod && !shipmentPickUpLocationId)"
            class="form__action-button"
            type="submit"
          >
            {{ $t('Go to billing') }}
          </SfButton>
          <SfButton
            class="form__action-button--secondary sf-button color-secondary"
            type="button"
            @click="goBack"
          >
            {{ $t('Go back') }}
          </SfButton>
        </div>
      </div>
    </form>
    <SfBottomModal @click:close="toggleStoresModal"
      :isOpen="isStoresModalOpen"
      title="Select pickup location"
      class="stores-modal" transition="appear">
      <SfScrollable maxContentHeight="15rem">
        <template #view-all>{{''}}</template>
            <StoresList
              :stores="stores"
              :selected="form.pickUpLocationId"
              @change="selectStoreForPickup"
            />
        </SfScrollable>
    </SfBottomModal>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfButton,
  SfIcon,
  SfBottomModal,
  SfScrollable
} from '@storefront-ui/vue';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { computed, ref, useRouter, watch } from '@nuxtjs/composition-api';
import { useUiNotification, useUiState } from '~/composables';
import { onSSR } from '@vue-storefront/core';
import { useUser,
  useFulfillmentMethods,
  useUserAddresses,
  storesGetters,
  useStores,
  useCart,
  cartGetters,
  fulfillmentMethodsGetters,
  userAddressGetters } from 'orc-vsf';
import { required, min, digits } from 'vee-validate/dist/rules';
import { ValidationObserver, extend } from 'vee-validate';
import AddressForm from '~/components/AddressForm';
import AddressPreview from '~/components/AddressPreview';
import AddressSelector from '~/components/AddressSelector';
import VsfShippingProvider from '../../components/Checkout/VsfShippingProvider';
import StoresList from '../../components/StoresList';
import { FulfillmentMethodType } from 'orc-vsf-api';

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
    StoresList,
    SfScrollable,
    SfBottomModal
  },
  setup (props, context) {
    const router = useRouter();
    const { send: sendNotification } = useUiNotification();
    const { cart, update, error, loading: loadingCart } = useCart();
    const { addresses, load: loadUserShipping, addAddress, loading: loadingAddresses, error: userAddressError } = useUserAddresses();
    const { load: loadFulfillmentMethods, fulfillmentMethods, loading: loadingFulfillmentMethods } = useFulfillmentMethods();
    const { isAuthenticated } = useUser();
    const { stores: storesList, search: loadStoresList } = useStores();
    const { isStoresModalOpen, toggleStoresModal } = useUiState();

    const methodsByType = computed(() => fulfillmentMethodsGetters.getFulfillmentMethodsGroupedByType(fulfillmentMethods.value));

    const shipment = computed(() => cartGetters.getActiveShipment(cart.value));
    const shipmentAddressId = computed(() => shipment.value?.address?.id);

    const stores = computed(() => storesGetters.getStoresForPickUp(storesList.value));

    const selectedStore = computed(() => stores.value?.find(x => x.id === shipment.value?.pickUpLocationId));
    const selectedStoreAddress = computed(() => {
      return {...shipment.value?.address, addressName: selectedStore.value?.name};
    });

    const shipmentPickUpLocationId = computed(() => shipment.value?.pickUpLocationId);

    const form = ref({
      shippingMethod: shipment.value?.fulfillmentMethod,
      pickUpLocationId: shipment.value?.pickUpLocationId
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

    const isShippingMethod = computed(() => cartGetters.isShipping(cart.value));
    const isPickupMethod = computed(() => cartGetters.isPickup(cart.value));

    const isOpen = ref({ addingAddress: false });

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

    const selectStoreForPickup = (value) => {
      form.value.pickUpLocationId = value;
      const selectedStore = stores.value.find(x => x.id === value);
      const updatedShipment = {
        ...shipment.value,
        pickUpLocationId: value,
        address: {...selectedStore.fulfillmentLocation.addresses[0], addressName: selectedStore.name },
        fulfillmentLocationId: selectedStore.fulfillmentLocation.id
      };
      onUpdate(updatedShipment, () => {});
      toggleStoresModal();
    };

    const updateShippingMethod = (value) => {
      const fulfillmentMethod = fulfillmentMethods.value.find(x => x.shippingProviderId === value);
      form.value.shippingMethod = fulfillmentMethod;

      const updatedShipment = {
        ...shipment.value,
        pickUpLocationId: null,
        fulfillmentLocationId: null,
        fulfillmentMethod
      };

      if (isAuthenticated.value && !shipment.value?.address?.id && updatedShipment.fulfillmentMethod.fulfillmentMethodType === FulfillmentMethodType.Shipping) {
        const preferredAddress = userAddressGetters.getDefaultShipping(addresses.value);

        form.value.addressId = preferredAddress?.id;
        updatedShipment.address = preferredAddress;
      }

      if (shipment.value?.fulfillmentMethod && updatedShipment.fulfillmentMethod.fulfillmentMethodType !== shipment.value.fulfillmentMethod.fulfillmentMethodType) {
        addressForm.value = resetForm();
        updatedShipment.address = null;
      }

      onUpdate(updatedShipment, () => {});
    };

    const updateAddress = (value) => updateCartAddress(addresses.value.find(x => x.id === value));

    const handleFormSubmit = () => {
      if (isShippingMethod.value && !isAuthenticated.value) {
        const updatedShipment = {
          ...shipment.value
        };
        updatedShipment.address = addressForm.value;
        onUpdate(updatedShipment, () => router.push(context.root.localePath({ name: 'billing' })));
      } else {
        router.push(context.root.localePath({ name: 'billing' }));
      }
    };

    onSSR(async () => Promise.allSettled([
      loadUserShipping(),
      loadFulfillmentMethods(),
      loadStoresList({})
    ]));

    watch(isAuthenticated, () => {
      if (isAuthenticated.value) {
        loadUserShipping();
      }
    });

    watch(isStoresModalOpen, ()=> {
      if (isStoresModalOpen.value) {
        const modalContent = document.getElementsByClassName(
          'sf-bottom-modal__container'
        )[0];
        disableBodyScroll(modalContent);
      } else {
        clearAllBodyScrollLocks();
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
      methodsByType,
      addresses,
      shipmentAddressId,
      stores,
      isPickupMethod,
      selectStoreForPickup,
      shipmentPickUpLocationId,
      selectedStore,
      selectedStoreAddress,
      isStoresModalOpen,
      toggleStoresModal
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
      margin: var(--spacer-sm) 0 var(--spacer-sm) 0;
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
  }
}

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}

.locationSelection {
  z-index: 1000;
}
.edit-location-button {
  display: block;
  margin: var(--spacer-xs) 0 var(--spacer-lg) 0;
}
.stores-modal {
  background: #fff;
  z-index: 1000;
}
</style>
