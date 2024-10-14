import axios from 'axios';
import apiConfig from './config';

const BASE_URL = `${apiConfig.API_URL}/tokens`;

const instance = axios.create();

const TokensService = {
  /// POST /tokens/acquire
  /*
    data: {
      "email": "string",
      "password": "string"
    }
  */
  acquire: (body) => instance.post(`${BASE_URL}/acquire`, body),

  /// POST /tokens/verify
  /*
    data: {
      "token": "string"
    }
  */
  verify: (accessToken) => instance.post(`${BASE_URL}/verify`, accessToken),

  /// POST /tokens/refresh
  /*
    data: {
      "refresh_token": "string"
    }
  */
  refresh: (refreshToken) => instance.post(`${BASE_URL}/refresh`, refreshToken),
};

export default TokensService;
