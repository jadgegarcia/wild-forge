import { useState } from 'react';

import { UsersService } from '../services';

const useSignup = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const signupUser = async ({ first_name, last_name, email, password, role, callbacks }) => {
    setIsSigningUp(true);

    let responseCode;
    let retrievedUser;

    try {
      const res = await UsersService.signup({
        first_name,
        last_name,
        email,
        password,
        role,
      });

      responseCode = res?.status;
      retrievedUser = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 201:
        await callbacks.signedUp({ retrievedUser });
        break;
      case 400:
        await callbacks.emailExists();
        break;
      case 500:
        await callbacks.internalError();
        break;
      default:
    }

    setIsSigningUp(false);
  };

  return { isSigningUp, signupUser };
};

export default useSignup;
