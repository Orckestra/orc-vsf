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
                  :class="{ 'shipping__action--is-active': item.isOpen }"
                  @click="
                      (item.isOpen = !item.isOpen),
                        $emit('toggle-info', item.value)
                    "
                >{{ item.isOpen ? "- info" : "+ info" }}
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
                <div v-if="item.isOpen" class="shipping__info">
                  {{ description }}
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
          <SfRadio
            v-for="item in addresses"
            :key="item.id"
            v-model="form.addressId"
            :label="item.addressName"
            :value="item.id"
            name="shippingAddress"
            class="form__radio shipping"
            @input="changeAddress"
          >
            <template #label="{ label }">
              <div class="sf-radio__label shipping__label">
                <div>
                  {{ label }}
                  <SfButton
                    class="sf-button--text shipping__action desktop-only"
                    :class="{ 'shipping__action--is-active': item.isOpen }"
                    @click="
                      (item.isOpen = !item.isOpen),
                        $emit('toggle-info', item.value)
                    "
                  >{{ item.isOpen ? "- info" : "+ info" }}
                  </SfButton>
                </div>
              </div>
            </template>
            <template  #description="{ description }">
              <div class="sf-radio__description shipping__description">
                <transition name="sf-fade">
                  <div v-if="item.isOpen" class="shipping__info">
                    <p>
                      {{ "sdfsdf" }}
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
          <template v-if="addingAddress">
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
                <AddressForm
                  :form="addressForm"
                />
                <div class="form__action-bar">
                  <SfButton
                    class="action-button sf-button"
                    :disabled="loading"
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
              class="action-button sf-button"
              :disabled="loading"
              @click="addNewAddress"
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
            :disabled="loading"
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
import { ref, useRouter } from '@nuxtjs/composition-api';
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
    const { cart } = useCart();
    const { addresses, load: loadUserShipping, addAddress } = useUserAddresses();
    const { load: loadCountries } = useCountries();
    const { load: loadFulfillmentMethods, fulfillmentMethods, loading } = useFulfillmentMethods();
    const { isAuthenticated } = useUser();

    const shipment = cartGetters.getShipment(cart.value);

    const form = ref({
      shippingMethod: shipment?.fulfillmentMethod?.shippingProviderId || fulfillmentMethods.value?.[0].shippingProviderId,
      addressId: null
    });

    const addressForm = ref({
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

    console.log(fulfillmentMethods.value);
    console.log(shipment);
    console.log(shipment?.fulfillmentMethod);
    console.log(fulfillmentMethodsGetters.getFulfillmentMethodType(fulfillmentMethods.value, form.value.shippingMethod));

    const addingAddress = ref(false);

    const updateShippingMethod = () => {
      console.log('updateShippingMethod');
    };

    const addNewAddress = () => {
      addingAddress.value = true;
      form.value.addressId = null;
    };

    const saveAddress = async ({ form, onComplete, onError }) => {
      console.log('saveAddress');

      try {
        addingAddress.value = false;
        //    await onComplete(data);
      } catch (error) {
        //    onError(error);
      }
    };

    const handleFormSubmit = async () => {
      console.log('handleFormSubmit');

      //  await save({ shippingDetails: form.value });
      router.push(context.root.localePath({ name: 'billing' }));
    };

    onSSR(async () => Promise.allSettled([
      loadUserShipping(),
      loadCountries(),
      loadFulfillmentMethods()
    ]));

    const goBack = () => {
      router.push(context.root.localePath({ name: 'personalDetails' }));
    };

    const changeAddress = (address) => {
      addingAddress.value = false;
    //  form.value.addressId = userAddressGetters.getId(address);
    };

    return {
      router,
      loading,
      addingAddress,
      form,
      addressForm,
      countries: [],
      isAuthenticated,
      saveAddress,
      addNewAddress,
      handleFormSubmit,
      updateShippingMethod,
      changeAddress,
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
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    --button-width: auto;
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
