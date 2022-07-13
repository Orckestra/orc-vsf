<template>
  <div>
    <SfHeading
      :level="3"
      :title="'Billing address'"
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
              name="billingAddress"
              class="form__radio billing"
              @input="updateAddress"
            >
              <template #label="{ label }">
                <div class="sf-radio__label billing__label">
                  <div>
                   {{ label }}
                  </div>
                  <SfButton
                    class="sf-button--text billing__action desktop-only"
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
                <div class="sf-radio__description billing__description">
                  <transition name="sf-fade">
                    <div v-if="isOpen[item.id]" class="billing__info">
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
              :title="'Add address'"
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
                    :disabled="loadingAddresses"
                  >
                    Save new address
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

    <template v-if="isBilling">
      <SfHeading
        :level="3"
        title="Payment"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <VsfPaymentProvider @status="isPaymentMethod = true"/>

    </template>
    <div class="summary">
        <div class="summary__group">
          <div v-e2e="'payment-summary-buttons'" class="summary__action">
            <SfButton
              type="button"
              class="sf-button color-secondary summary__back-button"
              @click="goBack"
            >
              {{ $t('Go back') }}
            </SfButton>
            <SfButton
              :disabled="loadingCart || !isPaymentMethod || !isBilling"
              class="summary__action-button"
              @click="goNext"
            >
              {{ $t('Review order') }}
            </SfButton>
          </div>
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
  SfLink
} from '@storefront-ui/vue';
import { ref, useRouter, computed } from '@nuxtjs/composition-api';
import { useCart, useUser, useUserAddresses, cartGetters } from '@vue-storefront/orc-vsf';
import { onSSR } from '@vue-storefront/core';
import AddressPreview from '~/components/AddressPreview';
import AddressForm from '~/components/Checkout/AddressForm';
import { ValidationObserver, extend } from 'vee-validate';

export default {
  name: 'ReviewOrder',
  components: {
    SfHeading,
    SfRadio,
    SfButton,
    SfDivider,
    SfIcon,
    SfProperty,
    SfLink,
    ValidationObserver,
    AddressPreview,
    AddressForm,
    VsfPaymentProvider: () => import('~/components/Checkout/VsfPaymentProvider')
  },
  setup(props, context) {
    const router = useRouter();
    const { cart, error, update, loading: loadingCart } = useCart();
    const isPaymentMethod = ref(false);
    const { isAuthenticated } = useUser();
    const { addresses, load: loadAddresses, addAddress, loading: loadingAddresses, error: userAddressError } = useUserAddresses();
    const isOpen = ref({ addingAddress: false });
    const activePayment = computed(() => cartGetters.getActivePayment(cart.value));
    const isBilling = computed(() => cartGetters.isBillingReady(cart.value));
    const form = ref({
      addressId: activePayment.value?.billingAddress?.id
    });

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
      onUpdate({ ...activePayment.value, billingAddress }, () => {});
    };

  const updateAddress = (value) => updateCartBillingAddress(addresses.value.find(x => x.id === value));

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

      } catch (error) {
        console.error(error);
      }
    };

    const goBack = () => {
      router.push(context.root.localePath({ name: 'shipping' }));
    };

    const goNext = () => {
      router.push(context.root.localePath({ name: 'review' }));
    };

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

    const addNewAddress = () => {
      addressForm.value = resetForm();
      isOpen.value.addingAddress = true;
      form.value.addressId = null;
    };

    onSSR(async () => Promise.allSettled([
      loadAddresses()
    ]));

    return {
      isAuthenticated,
      isBilling,
      goBack,
      goNext,
      router,
      form,
      isOpen,
      isPaymentMethod,
      loadingCart,
      loadingAddresses,
      addresses,
      addressForm,
      updateAddress,
      saveAddress,
      addNewAddress
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

.billing {
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
.price {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}
.product-price {
  --price-font-size: var(--font-size--base);
}
.summary {
  &__terms {
    margin: var(--spacer-base) 0 0 0;
  }
  &__total {
    margin: 0 0 var(--spacer-sm) 0;
    flex: 0 0 16.875rem;
  }
  &__action {
    @include for-desktop {
      display: flex;
      margin: var(--spacer-xl) 0 0 0;
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
      @include for-desktop {
        text-align: right;
      }
    }
  }
  &__back-button {
    margin: var(--spacer-xl) 0 0 0;
    width: 100%;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
    color:  var(--c-white);
    &:hover {
      color:  var(--c-white);
    }
  }
  &__property-total {
    margin: var(--spacer-xl) 0 0 0;
  }
}
.property {
  margin: 0 0 var(--spacer-sm) 0;
  &__name {
    color: var(--c-text-muted);
  }
}
.accordion {
  margin: 0 0 var(--spacer-xl) 0;
  &__item {
    display: flex;
    align-items: flex-start;
  }
  &__content {
    flex: 1;
  }
  &__edit {
    flex: unset;
  }
}
.content {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-text);
  &:last-child {
    margin: 0;
  }
  &__label {
    font-weight: var(--font-weight--normal);
  }
}
</style>
