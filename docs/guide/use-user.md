# useUser

## Features
`useUser` composable is responsible for register user, login, logout, load user information.

## API
```typescript
interface UseUser<USER, UserUpdateParams, API extends PlatformApi = any> extends Composable<API>  {
  register: (params: { user: UserRegisterParams; customQuery?: CustomQuery; }) => Promise<void>;
  login:(params: { user: UseUserLoginParams; customQuery?: CustomQuery; }) => Promise<void>;
  load: (params?: { customQuery: CustomQuery; }) => Promise<void>;
  changePassword: (params: { current: string; new: string; customQuery?: CustomQuery; }) => Promise<void>;
  logout: (params?: { customQuery: CustomQuery; }) => Promise<void>;
  setUser: (user: USER) => void;
  updateUser: (params: { user: UserUpdateParams; customQuery?: CustomQuery; }) => Promise<void>;
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UseUserErrors>;
  user: ComputedProperty<USER>;
  isAuthenticated: Ref<boolean>;
}

export interface UserRegisterParams {
  email:	string;
  firstName?:	string;
  lastName?: string;
  password:	string;
}

export interface UseUserLoginParams {
  userName?: string;
  password:	string;
}

export interface UserUpdateParams{
  cellNumber: string;
  customerType: string;
  email: string;
  faxExtension: string;
  faxNumber: string;
  firstname: string;
  language: string;
  lastname: string;
  passwordQuestion: string;
  phoneExtension: string;
  phoneExtensionWork: string;
  phoneNumber: string;
  phoneNumberWork: string;
  username: string;
}

```

### `register`
Function that register new user. 

### `login`
Function for authenticating user with email and password and retrieve token.

### `load`
Function that set some user info.

### `changePassword`
Function that change user password.

### `logout`
Function that logout user from system by removing the user's token.

### `setUser`
Function that set user.

### `updateUser`
Function that update user.

### `loading`
Reactive object containing information about the loading state.

### `error`
Reactive object containing the error message, if request failed for any reason.

## Example

```javascript
import { watch } from 'vue'
import { onSSR } from '@vue-storefront/core';
import { useUser } from 'orc-vsf';

export default {
  setup () {
   const { register, loading, error: userError } = useUser();
    const email = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const password = ref("");

    onSSR(async () => {
      await register({ email, firstName, lastName, password });
    });

    return {
      email,
      firstName,
      lastName
    }
  }
}
```

## Authentication
We use [JWT](https://jwt.io/) for authentication
Token saved in cookie 'vsf-occ-token' with "HttpOnly" without access from javascript
Data saved in cookie 'vsf-occ-data' and available from 


### `api-client`
Get the user with verifying in api Client use 
```cs
context.config.auth.getCustomerToken();
```
If the token is not valid, then getCustomerToken returns an empty object and sets a header "Token-Expired"
### `theme`
The plugin `token-expired.client.ts`

If the client received the "Token-Expired," then it will reload the page, the server should generate a new guest token and return it.

