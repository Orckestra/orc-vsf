# useUser

## Features
`useUser` composable is responsible for sending link to login by email.

## API
```typescript
interface UseForgotPasswordFactoryParams<RESULT> extends FactoryParams {
    resetPassword: (context: Context, params: ResetPasswordParams & {
        currentResult: RESULT;
        customQuery?: CustomQuery;
    }) => Promise<RESULT>;
    setNewPassword: (context: Context, params: SetNewPasswordParams & {
        currentResult: RESULT;
        customQuery?: CustomQuery;
    }) => Promise<RESULT>;
}

interface SetNewPasswordParams {
    tokenValue: string;
    newPassword: string;
}
interface ResetPasswordParams {
    email: string;
}

```

### `resetPassword`
Function that reset password. 

### `setNewPassword`
Function that set new user password.

## Example

```javascript
import { watch } from 'vue'
import { onSSR } from '@vue-storefront/core';
import { useUser } from '@vue-storefront/orc-vsf';

export default {
  setup () {
   const { resetPassword } = useForgotPassword();
    const email = ref("");

    onSSR(async () => {
      await useForgotPassword({ email });
    });

    return {
      email
    }
  }
}
```