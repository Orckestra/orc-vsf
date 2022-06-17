# useUserShipping

## Features
`useCountries` composable is responsible for fetching a list of user addresses. A common usage scenario for this composable is getting user addresses.

## API
```typescript
export declare type UserAddress = {
  addressName: string;
  city: string;
  countryCode: string;
  email: string;
  firstName: string;
  id: string;
  isPreferredBilling: boolean;
  isPreferredShipping: boolean;
  lastModified: string;
  lastModifiedBy: string;
  lastName: string;
  latitude: number;
  line1: string;
  line2: string;
  longitude: number;
  notes: string;
  phoneExtension: string;
  phoneNumber: string;
  postalCode: string;
  propertyBag: object;
  regionCode: string;
};
```

### `load`
Function that gets the `shipping` for current user.

### `shipping`
Returns an array of addresses fetched by `load` method as a `AddressItem[]` property.

### `loading`
Returns the current state of `load` as `computed` `boolean` property

### `error`
Reactive object containing the error message, if load failed for any reason.

### `addAddress`
Function that add new address for current user.

### `deleteAddress`
Function that delete selected address for current user.

### `updateAddress`
Function that update selected address for current user.

### `setDefaultAddress`
Function that set selected address as default for current user.

## Getters
````typescript
export interface UserShippingGetters<USER_SHIPPING, USER_SHIPPING_ITEM> {
  getAddresses: (shipping: USER_SHIPPING, criteria?: Record<string, any>) => USER_SHIPPING_ITEM[];
  getDefault: (shipping: USER_SHIPPING) => USER_SHIPPING_ITEM;
  getTotal: (shipping: USER_SHIPPING) => number;
  getPostCode: (address: USER_SHIPPING_ITEM) => string;
  getStreetName: (address: USER_SHIPPING_ITEM) => string;
  getStreetNumber: (address: USER_SHIPPING_ITEM) => string | number;
  getCity: (address: USER_SHIPPING_ITEM) => string;
  getFirstName: (address: USER_SHIPPING_ITEM) => string;
  getLastName: (address: USER_SHIPPING_ITEM) => string;
  getCountry: (address: USER_SHIPPING_ITEM) => string;
  getPhone: (address: USER_SHIPPING_ITEM) => string;
  getEmail: (address: USER_SHIPPING_ITEM) => string;
  getProvince: (address: USER_SHIPPING_ITEM) => string;
  getCompanyName: (address: USER_SHIPPING_ITEM) => string;
  getTaxNumber: (address: USER_SHIPPING_ITEM) => string;
  getId: (address: USER_SHIPPING_ITEM) => string | number;
  getApartmentNumber: (address: USER_SHIPPING_ITEM) => string | number;
  isDefault: (address: USER_SHIPPING_ITEM) => boolean;
}
````
## Example

```javascript
import { onSSR } from '@vue-storefront/core';
import { useUserShipping, userShippingGetters } from '@vue-storefront/orc-vsf';

export default {
  setup () {
    const { shipping, load: loadUserShipping, loading, addAddress, deleteAddress, updateAddress } = useUserShipping();
    const addresses = computed(() => userShippingGetters.getAddresses(shipping.value));
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
    
    onSSR(async () => {
      await loadUserShipping();
    });

    return {
      addresses,
      loading,
      changeAddress,
      cancelEditing,
      removeAddress,
      saveAddress
    }
  }
}
```
