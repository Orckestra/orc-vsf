<template>
  <transition name="fade">
    <SfTabs
      v-if="edittingAddress"
      key="edit-address"
      :open-tab="1"
      class="tab-orphan"
    >
      <SfTab
        :title="isNewAddress ? 'Add the address' : 'Update the address'">
        <p class="message">
          {{ $t('Contact details updated') }}
        </p>

        <ShippingAddressForm
          :address="activeAddress"
          :isNew="isNewAddress"
          @submit="saveAddress"
          @cancel="cancelEditing"
        />
      </SfTab>
    </SfTabs>

    <SfTabs
      v-else
      :open-tab="1"
      key="address-list"
      class="tab-orphan">
      <SfTab title="Shipping details">
        <p class="message">
          {{ $t('Manage shipping addresses') }}
        </p>
        <transition-group tag="div" name="fade" class="shipping-list">
          <div
            v-for="address in addresses"
            :key="userAddressGetters.getId(address)"
            class="shipping" :class="{'shipping__preferred': address.isPreferredShipping }">
            <div class="shipping__content">
              <div class="shipping__address">
                <AddressPreview :address="address" :showName="true" />
                <SfButton
                  v-if="!address.isPreferredShipping"
                  class="sf-button--text sf-button"
                  @click="setDefault(address)">
                  {{'Set as default'}}
                </SfButton>
                 <span v-else class="shipping__preferred-label">
                    (preferred shipping address)
                </span>
              </div>
            </div>
            <div class="shipping__actions">
              <SfIcon
                icon="cross"
                color="gray"
                size="14px"
                role="button"
                class="smartphone-only"
                @click="removeAddress(address)"
              />
              <SfButton
                @click="changeAddress(address)">
                {{ $t('Change') }}
              </SfButton>

              <SfButton
                class="color-light shipping__button-delete desktop-only"
                @click="removeAddress(address)">
                {{ $t('Delete') }}
              </SfButton>

            </div>
          </div>
        </transition-group>
        <SfButton
          class="action-button"
          @click="changeAddress()">
          {{ $t('Add new address') }}
        </SfButton>
      </SfTab>
    </SfTabs>
  </transition>
</template>
<script>
import {
  SfTabs,
  SfButton,
  SfIcon
} from '@storefront-ui/vue';
import AddressPreview from '~/components/AddressPreview';
import ShippingAddressForm from '~/components/MyAccount/ShippingAddressForm';
import { useUserAddresses, userAddressGetters } from '@vue-storefront/orc-vsf';
import { ref, computed } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'ShippingDetails',
  components: {
    SfTabs,
    SfButton,
    SfIcon,
    ShippingAddressForm,
    AddressPreview
  },
  setup() {
    const { addresses, load: loadUserAddresses, addAddress, deleteAddress, updateAddress, setDefaultShipping } = useUserAddresses();
    const edittingAddress = ref(false);
    const activeAddress = ref(undefined);
    const isNewAddress = computed(() => !activeAddress.value);

    const changeAddress = (address = undefined) => {
      activeAddress.value = address;
      edittingAddress.value = true;
    };

    const cancelEditing = () => {
      activeAddress.value = undefined;
      edittingAddress.value = false;
    };

    const removeAddress = address => deleteAddress({ address });

    const setDefault = address => setDefaultShipping({ address });

    const saveAddress = async ({ form, onComplete, onError }) => {
      try {
        const actionMethod = isNewAddress.value ? addAddress : updateAddress;
        const data = await actionMethod({ address: form });
        edittingAddress.value = false;
        activeAddress.value = undefined;
        await onComplete(data);
      } catch (error) {
        onError(error);
      }
    };

    onSSR(() => {
      if (!addresses.value || !addresses.value.length) {
        loadUserAddresses();
      }
    });

    return {
      changeAddress,
      removeAddress,
      saveAddress,
      cancelEditing,
      setDefault,
      userAddressGetters,
      addresses,
      edittingAddress,
      activeAddress,
      isNewAddress
    };
  }
};
</script>

<style lang='scss' scoped>

.message {
  font-family: var(--font-family--primary);
  line-height: 1.6;
  font-size: var(--font-size--base);
  margin: 0 0 var(--spacer-base);
}
.shipping-list {
  margin-bottom: var(--spacer-base);
}
.shipping {
  display: flex;
  padding: var(--spacer-xs) var(--spacer-xs);
  border-top: 1px solid var(--c-light);
  &__preferred {
    border: solid 2px var(--c-primary) !important;

    &-label {
       color: var(--c-primary);
    }
  }

  &__address {
    margin: var(--spacer-xs) 0 var(--spacer-xs) 0;
  }

  &:last-child {
    border-bottom: 1px solid var(--c-light);
  }
  &__content {
    flex: 1;
    color: var(--c-text);
    font-size: var(--font-size--base);
    font-weight: 300;
    line-height: 1.6;
  }
  &__actions {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    @include for-desktop {
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      button {
        &:not(:first-child) {
          margin-left: var(--spacer-base);
        }
      }
    }
  }
  &__button-delete {
    color: var(--c-link);
  }
  &__client-name {
    font-size: var(--font-size--base);
    font-weight: 500;
  }
}
.action-button {
  width: 100%;
  @include for-desktop {
    width: auto;
  }
}
.tab-orphan {
  @include for-mobile {
    ::v-deep .sf-tabs {
      &__title {
        display: none;
      }

      &__content {
        border: 0;
        padding: 0;
      }
    }
  }
}
</style>
