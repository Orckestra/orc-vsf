<template>
  <div>
    <SfHeading
      :level="3"
      :title="'Billing address'"
      class="sf-heading--left sf-heading--no-underline title"
    />
        <template v-if="isAuthenticated">

          <AddressSelector
            :addresses="addresses"
            :selected="billingAddressId"
            @input="updateAddress" />

          <template v-if="isOpen.addingAddress">
            <SfHeading
              :level="4"
              :title="'Add address'"
              class="sf-heading--left sf-heading--no-underline title"
            />
            <ValidationObserver v-slot="{ handleSubmit: hS }">
              <form
                class="form"
                @submit.prevent="hS(saveAddress)">

                <AddressForm :form="addressForm" />

                <div class="form__action-bar">
                  <SfButton
                    type="button"
                    class="form__action-button--secondary color-light sf-button"
                    @click="cancelEditing">
                      {{ $t('Cancel') }}
                  </SfButton>
                  <SfButton
                    class="form__action-button--primary sf-button color-primary"
                    :disabled="loadingAddresses">
                    Save address
                  </SfButton>
                </div>

              </form>
            </ValidationObserver>
          </template>
          <template v-else>
            <SfButton
              class="action-button sf-button form__action-button--add-address sf-button--pure"
              :disabled="loadingAddresses || loadingCart"
              type="button"
              @click="addNewAddress">
              <SfIcon
                icon="plus"
                size="sm"
                color="green-primary"
                viewBox="0 0 24 24"
                :coverage="1"
              />
              <span>Add a new address</span>
            </SfButton>
          </template>
        </template>
        <template v-else>
        <ValidationObserver v-slot="{ handleSubmit: hS }">
          <div class="sameAsShipping">
            <SfCheckbox
              v-model="sameAsShipping"
              :value="sameAsShipping"
              label="Use my shipping address"
              name="copyShippingAddress"
              class="form__element form__checkbox"
              @change="useShippingAddress"
            />
          </div>

           <template v-if="isBilling && !isOpen.editingAddress">
             <AddressPreview :address="billingAddress"/>
             <SfButton
                  class="sf-button--text"
                  @click="editGuestAddress">
                Edit billing address
            </SfButton>
           </template>
            <form
                v-if="isOpen.editingAddress"
                class="form"
                @submit.prevent="hS(saveAddress)">
              <AddressForm
                :form="addressForm"
                :showName="false"
              />
              <div class="form__action-bar">
                <SfButton
                  type="button"
                  v-if="isBilling"
                  class="form__action-button--secondary color-light sf-button"
                  @click="cancelEditing">
                  {{ $t('Cancel') }}
                </SfButton>
                <SfButton
                  class="form__action-button--primary sf-button sf-button--primary"
                  :disabled="loadingCart || !isAddressFormReady">
                   {{ $t('Save address') }}
                </SfButton>
              </div>
            </form>
         </ValidationObserver>
        </template>

    <div v-show="isBilling">
      <SfHeading
        :level="3"
        title="Payment"
        class="sf-heading--left sf-heading--no-underline title"
      />

      <VsfPaymentProvider @status="isPaymentMethod = true"/>

    </div>
    <div class="form">
      <div v-e2e="'payment-summary-buttons'" class="form__action-bar">
            <SfButton
              type="button"
              class="form__action-button--secondary sf-button color-secondary"
              @click="goBack"
            >
              {{ $t('Go back') }}
            </SfButton>
            <SfButton
              :disabled="loadingCart || !isPaymentMethod || !isBilling"
              class="form__action-button"
              @click="goNext"
            >
              {{ $t('Review order') }}
            </SfButton>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SfHeading,
  SfButton,
  SfRadio,
  SfDivider,
  SfIcon,
  SfProperty,
  SfLink,
  SfCheckbox
} from '@storefront-ui/vue';
import { ref, useRouter, computed, watch } from '@nuxtjs/composition-api';
import { useCart, useUser, useUserAddresses, userAddressGetters, cartGetters } from '@vue-storefront/orc-vsf';
import { onSSR } from '@vue-storefront/core';
import AddressPreview from '~/components/AddressPreview';
import AddressForm from '~/components/AddressForm';
import AddressSelector from '~/components/AddressSelector';
import { ValidationObserver } from 'vee-validate';
import { useUiNotification } from '~/composables';

export default {
  name: 'ReviewOrder',
  components: {
    SfHeading,
    SfRadio,
    SfCheckbox,
    SfButton,
    SfDivider,
    SfIcon,
    SfProperty,
    SfLink,
    ValidationObserver,
    AddressPreview,
    AddressForm,
    AddressSelector,
    VsfPaymentProvider: () => import('~/components/Checkout/VsfPaymentProvider')
  },
  setup(props, context) {
    const router = useRouter();
    const { send: sendNotification } = useUiNotification();
    const { cart, error, update, loading: loadingCart } = useCart();
    const isPaymentMethod = ref(false);
    const { isAuthenticated } = useUser();
    const activePayment = computed(() => cartGetters.getActivePayment(cart.value));
    const billingAddress = computed(() => activePayment.value?.billingAddress);
    const billingAddressId = computed(() => billingAddress.value?.id);
    const isBilling = computed(() => cartGetters.isBillingReady(cart.value));
    const { addresses, load: loadAddresses, addAddress, loading: loadingAddresses, error: userAddressError } = useUserAddresses();
    const isOpen = ref({ addingAddress: false, editingAddress: !isAuthenticated.value && !isBilling.value });
    const shipmentAddress = computed(() => cartGetters.getActiveShipment(cart.value)?.address);

    const areAddressEqual = (addr1, addr2) => {

      if(!addr1 || !addr2) return false;
      
       return addr1.firstName === addr2.firstName &&
              addr1.lastName === addr2.lastName &&
              addr1.line1 === addr2.line1 &&
              addr1.line2 === addr2.line2 &&
              addr1.city === addr2.city &&
              addr1.countryCode === addr2.countryCode &&
              addr1.regionCode === addr2.regionCode &&
              addr1.postalCode == addr2.postalCode
    }
    const sameAsShipping = ref(areAddressEqual(billingAddress.value, shipmentAddress.value));

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

    const addressForm = ref(resetForm(activePayment.value?.billingAddress));
    const isAddressFormReady = computed(() => cartGetters.isAddressReady(addressForm.value));

    const onUpdate = async (updatedPayment, onComplete) => {
      const updatedCart = {
        ...cart.value,
        payments: cart.value.payments.map(x => x.id === activePayment.value.id ? updatedPayment : x)
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

    const updateCartBillingAddress = (billingAddress) => {
      isOpen.value.addingAddress = false;
      isOpen.value.editingAddress = false;
      onUpdate({ ...activePayment.value, billingAddress }, () => {});
      sameAsShipping.value = areAddressEqual(billingAddress, shipmentAddress.value);
    };

    const updateAddress = (value) => updateCartBillingAddress(addresses.value.find(x => x.id === value));

    const saveAddress = async () => {
      if (isAuthenticated.value) {

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
            updateCartBillingAddress(address);
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

      } else {
        updateCartBillingAddress(addressForm.value);
      }
    };

    const goBack = () => {
      router.push(context.root.localePath({ name: 'shipping' }));
    };

    const goNext = () => {
      router.push(context.root.localePath({ name: 'review' }));
    };

    const addNewAddress = () => {
      addressForm.value = resetForm();
      isOpen.value.addingAddress = true;
    };

    const editGuestAddress = () => {
      addressForm.value = resetForm(activePayment.value?.billingAddress);
      isOpen.value.editingAddress = true;
      sameAsShipping.value = false;
    };

    const cancelEditing = () => {
      isOpen.value.editingAddress = false;
      isOpen.value.addingAddress = false;
      sameAsShipping.value = areAddressEqual(billingAddress.value, shipmentAddress.value);
    };

    const useShippingAddress = (value) => {
      if(!sameAsShipping.value) {
        addressForm.value = resetForm({});
        isOpen.value.editingAddress = true;
      } else {
        updateCartBillingAddress(shipmentAddress.value);
      }
    }

    onSSR(async () => {
      if (isAuthenticated.value) {
        await loadAddresses();
      }

      if (!isBilling.value) {
        const address = userAddressGetters.getDefaultBilling(addresses.value) ?? cartGetters.getActiveShipment(cart.value)?.address;
        if (address) {
          await updateCartBillingAddress(address);
        }
      }
    });

    watch(isAuthenticated, () => {
      if (isAuthenticated.value) {
        loadAddresses();
      }
    });

    return {
      sameAsShipping,
      useShippingAddress,
      billingAddress,
      billingAddressId,
      isAuthenticated,
      isBilling,
      goBack,
      goNext,
      router,
      isOpen,
      isPaymentMethod,
      loadingCart,
      loadingAddresses,
      addresses,
      addressForm,
      isAddressFormReady,
      updateAddress,
      saveAddress,
      addNewAddress,
      editGuestAddress,
      cancelEditing
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
    margin-top: var(--spacer-xs);
    margin-bottom: var(--spacer-xl);
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
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
      margin: 0;
      @include for-desktop {
        margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
}

.sameAsShipping {
  margin-bottom: var(--spacer-sm);
}

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
</style>
