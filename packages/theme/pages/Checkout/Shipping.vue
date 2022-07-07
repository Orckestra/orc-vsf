<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <SfHeading
      v-e2e="'shipping-heading'"
      :level="3"
      :title="$t('Shipping method')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <div class="form__radio-group" data-testid="shipping-method">
        <SfRadio
          v-for="item in fulfillmentMethods"
          :key="item.shippingProviderId"
          v-model="form.shippingMethod"
          :label="item.displayName || item.name"
          :value="item.shippingProviderId"
          name="shippingMethod"
          :description="item.fulfillmentMethodType"
          class="form__radio shipping"
          @input="updateShippingMethod"
        >
          <template #label="{ label }">
            <div class="sf-radio__label shipping__label">
              <div>
                {{ label }}
                <SfButton
                  class="sf-button--text shipping__action desktop-only"
                  :class="{ 'shipping__action--is-active': isOpen[item.shippingProviderId] }"
                  type="button"
                  @click="(isOpen = { ...isOpen, [item.shippingProviderId]: !isOpen[item.shippingProviderId] })"
                >{{ isOpen[item.shippingProviderId] ? "- info" : "+ info" }}
                </SfButton>
              </div>
              <div class="shipping__label-price">{{ item.price }}</div>
            </div>
          </template>
          <template #description="{ description }">
            <div class="sf-radio__description shipping__description">
              <div class="shipping__delivery">
                <span>{{ item.delivery }}</span>
              </div>
              <transition name="sf-fade">
                <div v-if="isOpen[item.shippingProviderId]" class="shipping__info">
                  {{ item.fulfillmentMethodType }}
                </div>
              </transition>
            </div>
          </template>
        </SfRadio>
      </div>
      <template v-if="fulfillmentMethodsGetters.getFulfillmentMethodType(fulfillmentMethods, form.shippingMethod) === 'Shipping'">
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
              @input="(isOpen.addingAddress = false)"
            >
              <template #label="{ label }">
                <div class="sf-radio__label shipping__label">
                  <div>
                    {{ label }}
                    <SfButton
                      class="sf-button--text shipping__action desktop-only"
                      :class="{ 'shipping__action--is-active': isOpen[item.id] }"
                      type="button"
                      @click="(isOpen = { ...isOpen, [item.id]: !isOpen[item.id] })"
                    >{{ isOpen[item.id] ? "- info" : "+ info" }}
                    </SfButton>
                  </div>
                </div>
              </template>
              <template  #description="{ description }">
                <div class="sf-radio__description shipping__description">
                  <transition name="sf-fade">
                    <div v-if="isOpen[item.id]" class="shipping__info">
                      <p>
                        <span>{{ item.firstName }} {{ item.lastName }}</span><br />
                        {{ item.line1 }} {{ item.line2 }} {{item.city}} {{item.regionCode}} {{item.postalCode}}
                      </p>
                      <p>
                        {{ item.phoneNumber }}
                      </p>
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
            <ValidationObserver v-slot="{ handleSubmit: hS, reset }">
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
              class="action-button sf-button form__action-button--add-address"
              :disabled="loadingFulfillmentMethods || loadingAddresses || loadingCart"
              type="button"
              @click="(isOpen.addingAddress = true),(form.addressId = null)"
            >
              Add a new address
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
            :disabled="loadingFulfillmentMethods || loadingAddresses || loadingCart || isOpen.addingAddress"
            class="form__action-button"
            type="submit"
          >
            {{ $t('Select shipping method') }}
          </SfButton>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect, SfRadio
} from '@storefront-ui/vue';
import { ref, useRouter, watch } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';
import { onSSR } from '@vue-storefront/core';
import { useCountries, useUser, useFulfillmentMethods, useUserAddresses, useCart, cartGetters, fulfillmentMethodsGetters, userAddressGetters } from '@vue-storefront/orc-vsf';
import { required, min, digits } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import AddressForm from '~/components/Checkout/AddressForm';
import UserShippingAddress from '~/components/UserShippingAddress';

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
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    ValidationProvider,
    ValidationObserver,
    AddressForm,
    UserShippingAddress
  },
  setup (props, context) {
    const router = useRouter();
    const { send: sendNotification } = useUiNotification();
    const { cart, update, error, loading: loadingCart } = useCart();
    const { addresses, load: loadUserShipping, addAddress, loading: loadingAddresses, error: userAddressError } = useUserAddresses();
    const { load: loadCountries } = useCountries();
    const { load: loadFulfillmentMethods, fulfillmentMethods, loading: loadingFulfillmentMethods } = useFulfillmentMethods();
    const { isAuthenticated } = useUser();

    const shipment = cartGetters.getShipment(cart.value);

    const isOpen = ref({ addingAddress: false });
    const form = ref({
      shippingMethod: shipment?.fulfillmentMethod?.shippingProviderId || fulfillmentMethods.value[0]?.shippingProviderId,
      addressId: shipment?.address?.id || addresses.value?.find(x => x.isPreferredShipping)?.id
    });

    const resetForm = () => ({
      addressName: '',
      firstName: '',
      lastName: '',
      line1: '',
      line2: '',
      city: '',
      regionCode: '',
      postalCode: '',
      countryCode: '',
      phoneNumber: ''
    });
    const addressForm = ref(resetForm());

    watch(fulfillmentMethods, () => {});

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
          isOpen.value.addingAddress = false;
          form.value.addressId = addresses.value.find(x => x.addressName === addressForm.value.addressName)?.id;
          addressForm.value = resetForm();

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

    const onUpdate = async (updatedShipment, onComplete) => {
      const updatedCart = {
        ...cart.value,
        shipments: cart.value.shipments.map(x => x.id === shipment.id ? updatedShipment : x)
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

    const updateShippingMethod = () => {
    };

    const handleFormSubmit = () => {
      const fulfillmentMethod = fulfillmentMethods.value.find(x => x.shippingProviderId === form.value.shippingMethod);

      const updatedShipment = {
        ...shipment,
        address: addresses.value.find(x => x.id === form.value.addressId),
        fulfillmentMethod: { ...fulfillmentMethod, displayName: undefined }
      };

      onUpdate(updatedShipment, () => router.push(context.root.localePath({ name: 'billing' })));
    };

    onSSR(async () => Promise.allSettled([
      loadUserShipping(),
      loadCountries(),
      loadFulfillmentMethods()
    ]));

    const goBack = () => {
      router.push(context.root.localePath({ name: 'personalDetails' }));
    };

    return {
      router,
      loadingFulfillmentMethods,
      loadingAddresses,
      loadingCart,
      isOpen,
      form,
      addressForm,
      countries: [],
      isAuthenticated,
      saveAddress,
      handleFormSubmit,
      updateShippingMethod,
      goBack,
      fulfillmentMethods,
      addresses,
      fulfillmentMethodsGetters,
      userAddressGetters
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
