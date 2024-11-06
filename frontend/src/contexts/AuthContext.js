import React, { useState, createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

import { hash, dehash } from '../utils/mask';

const AuthContext = createContext({
  uuid: null,
  accessToken: null,
  refreshToken: null,
  setUuid: () => {},
  setAccessToken: () => {},
  setRefreshToken: () => {},
});

export function AuthProvider({ children }) {
  const [uuid, setUuid] = useState(localStorage.getItem('uuid'));
  const [accessToken, setAccessToken_] = useState(Cookies.get('access_token'));
  const [refreshToken, setRefreshToken_] = useState(dehash(Cookies.get('refresh_token'), uuid));

  const setAccessToken = (newAccessToken) => {
    if (newAccessToken) {
      Cookies.set('access_token', newAccessToken);
    } else {
      Cookies.remove('access_token');
    }

    setAccessToken_(newAccessToken);
  };

  const setRefreshToken = (newRefreshToken) => {
    if (newRefreshToken) {
      const jti = jwtDecode(newRefreshToken)?.jti;
      localStorage.setItem('uuid', jti);
      setUuid(jti);

      const token = hash(newRefreshToken, jti);
      Cookies.set('refresh_token', token);
    } else {
      Cookies.remove('refresh_token');
      localStorage.removeItem('uuid');
    }

    setRefreshToken_(newRefreshToken);
  };

  const authContextValue = useMemo(
    () => ({
      uuid,
      accessToken,
      refreshToken,
      setUuid,
      setAccessToken,
      setRefreshToken,
    }),
    [accessToken, refreshToken]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

AuthProvider.defaultProps = {
  children: null,
};

AuthProvider.propTypes = {
  children: PropTypes.any,
};
