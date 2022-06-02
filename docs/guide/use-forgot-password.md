# useForgotPassword

## Features
`useForgotPassword` composable is responsible for sending reset password token to the email and setting new password with this token.

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
Fuction that send link with reset password token to the provided email

### `setNewPassword`
Function that set new users password.

## Example

```javascript
import { watch } from 'vue'
import { onSSR } from '@vue-storefront/core';
import { useUser } from '@vue-storefront/orc-vsf';

export default {
  setup () {
   const { resetPassword, setNew, result } = useForgotPassword();
    const email = ref("");
    const password = ref("");
    const ticket = ref("");

    onSSR(async () => {
      await useForgotPassword({ email });

      await setNew({
        tokenValue: ticket,
        newPassword: password
      });
    });

    return {
      email,
      result
    }
  }
}
```