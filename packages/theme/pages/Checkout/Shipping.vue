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
      <template v-if="isShipping">
        <SfHeading
          :level="4"
          :title="'Shipping address'"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <template v-if="isAuthenticated">
          <div class="form__radio-group" >
            <SfRadio
              v-for="item in addresses"
              :key="item.id"
              v-model="form.addressId"
              :label="item.addressName"
              :value="item.id"
              name="shippingAddress"
              class="form__radio shipping"
              @input="updateAddress"
            >
              <template #label="{ label }">
                <div class="sf-radio__label shipping__label">
                  <div>
                   {{ label }}
                  </div>
                  <SfButton
                    class="sf-button--text shipping__action desktop-only"
                    :class="{ 'shipping__action--is-active': isOpen[item.id] }"
                    type="button"
                    @click="(isOpen = { ...isOpen, [item.id]: !isOpen[item.id] })"
                  ><SfIcon
                    icon="more"
                    size="22px"
                    color="black"
                  />
                  </SfButton>
                </div>
              </template>
              <template  #description>
                <div class="sf-radio__description shipping__description">
                  <transition name="sf-fade">
                    <div v-if="isOpen[item.id]" class="shipping__info">
                      <AddressPreview :address="item" />
                    </div>
                  </transition>
                </div>
              </template>
            </SfRadio>
          </div>
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
                    class="action-button sf-button form__action-button--add-address"
                    :disabled="loadingFulfillmentMethods || loadingAddresses"
                  >
                    Save new address
                  </SfButton>
    <!--              <SfButton
                    class="action-button color-secondary cancel-button sf-button"
                    @click.prevent="cancelEdit"
                  >
                    {{ $t('Cancel') }}
                  </SfButton>-->
                </div>
              </form>
            </ValidationObserver>
          </template>
          <template v-else>
            <SfButton
              class="action-button sf-button form__action-button--add-address sf-button--pure"
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
      <div class="form">
        <div class="form__action">
          <SfButton
            class="sf-button color-secondary form__back-button"
            type="button"
            @click="goBack"
          >
            {{ $t('Go back') }}
          </SfButton>
          <SfButton
            :disabled="loadingFulfillmentMethods || loadingAddresses || loadingCart || (isAuthenticated && isShipping && !form.addressId) || !form.shippingMethod"
            class="form__action-button"
            type="submit"
          >
            {{ $t('Go to Payment') }}
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
  SfRadio,
  SfIcon
} from '@storefront-ui/vue';
import { computed, ref, useRouter, watch } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';
import { onSSR } from '@vue-storefront/core';
import { useUser, useFulfillmentMethods, useUserAddresses, useCart, cartGetters, fulfillmentMethodsGetters, userAddressGetters } from '@vue-storefront/orc-vsf';
import { required, min, digits } from 'vee-validate/dist/rules';
import { ValidationObserver, extend } from 'vee-validate';
import AddressForm from '~/components/Checkout/AddressForm';
import AddressPreview from '~/components/AddressPreview';
import VsfShippingProvider from '../../components/Checkout/VsfShippingProvider';
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
    SfRadio,
    ValidationObserver,
    AddressForm,
    AddressPreview,
    VsfShippingProvider,
    SfIcon
  },
  setup (props, context) {
    const router = useRouter();
    const { send: sendNotification } = useUiNotification();
    const { cart, update, error, loading: loadingCart } = useCart();
    const { addresses, load: loadUserShipping, addAddress, loading: loadingAddresses, error: userAddressError } = useUserAddresses();
    const { load: loadFulfillmentMethods, fulfillmentMethods, loading: loadingFulfillmentMethods } = useFulfillmentMethods();
    const { isAuthenticated } = useUser();

    const shipment = computed(() => cartGetters.getActiveShipment(cart.value));

    const isOpen = ref({ addingAddress: false });
    const form = ref({
      shippingMethod: shipment.value?.fulfillmentMethod?.shippingProviderId,
      addressId: shipment.value?.address?.id
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

    const isShipping = computed(() => fulfillmentMethodsGetters.getFulfillmentMethodType(fulfillmentMethods.value, form.value.shippingMethod) === 'Shipping');

    const addNewAddress = () => {
      addressForm.value = resetForm();
      isOpen.value.addingAddress = true;
      form.value.addressId = null;
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
        await addAddress({ address: addressForm.value });

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
            form.value.addressId = address?.id;
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

      onUpdate(updatedShipment, () => {});
    };

    const updateAddress = (value) => updateCartAddress(addresses.value.find(x => x.id === value));

    const handleFormSubmit = () => {
      const updatedShipment = {
        ...shipment.value
      };

      if (isShipping.value && !isAuthenticated.value) {
        updatedShipment.address = addressForm.value;
      }

      onUpdate(updatedShipment, () => router.push(context.root.localePath({ name: 'payment' })));
    };

    onSSR(async () => Promise.allSettled([
      loadUserShipping(),
      loadFulfillmentMethods()
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
      isShipping,
      isOpen,
      form,
      addressForm,
      isAuthenticated,
      addNewAddress,
      saveAddress,
      handleFormSubmit,
      updateShippingMethod,
      updateAddress,
      goBack,
      fulfillmentMethods,
      addresses,
      fulfillmentMethodsGetters
    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  --button-width: 100%;
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  &__radio {
    margin: var(--spacer-xs) 0;
    &:last-of-type {
      margin: var(--spacer-xs) 0 var(--spacer-xl);
    }
    ::v-deep .sf-radio__container {
      --radio-container-padding: var(--spacer-xs);
      @include for-desktop {
        --radio-container-padding: var(--spacer-xs) var(--spacer-xs)
        var(--spacer-xs) var(--spacer-sm);
      }
    }
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    --button-width: auto;

    &__radio-group {
      flex: 0 0 calc(100% + var(--spacer-sm));
      margin: 0 calc(-1 * var(--spacer-sm));
    }
  }
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    &--secondary {
      @include for-desktop {
        order: -1;
        text-align: left;
      }
    }
    &--add-address {
      width: 100%;
      margin: 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
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

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
</style>
