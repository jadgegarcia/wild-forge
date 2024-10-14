import { useState } from 'react';

import { TokensService } from '../services';

const useAcquireTokens = () => {
  const [isAcquiring, setIsAcquiring] = useState(false);

  const acquireTokens = async ({ email, password, callbacks }) => {
    setIsAcquiring(true);

    let responseCode;
    let accessToken;
    let refreshToken;

    try {
      const res = await TokensService.acquire({
        email,
        password,
      });

      responseCode = res.status;
      accessToken = res.data.access;
      refreshToken = res.data.refresh;
    } catch (error) {
      responseCode = error.response.status;
    }

    switch (responseCode) {
      case 200:
        await callbacks.acquired({ accessToken, refreshToken });
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

    setIsAcquiring(false);
  };

  return { isAcquiring, acquireTokens };
};

export default useAcquireTokens;
