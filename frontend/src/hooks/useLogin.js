import { useState } from 'react';

import { UsersService } from '../services';

const useLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const loginUser = async ({ email, password, callbacks }) => {
    setIsLoggingIn(true);

    let responseCode;
    let retrievedUser;

    try {
      const res = await UsersService.login({
        email,
        password,
      });

      responseCode = res?.status;
      retrievedUser = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        await callbacks.loggedIn({ retrievedUser });
        break;
      case 401:
      case 400:
        await callbacks.invalidFields();
        break;
      case 500:
        await callbacks.internalError();
        break;
      default:
    }

    setIsLoggingIn(false);
  };

  return { isLoggingIn, loginUser };
};

export default useLogin;
