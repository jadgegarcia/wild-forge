import axios from 'axios';
import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/users`;

const instance = axios.create();

const UsersService = {
  /// POST /users
  /*
    data: {
      "first_name": "string",
      "last_name": "string",
      "email": "user@example.com",
      "password": "string",
      "role": 2
    }
  */
  signup: (user) => instance.post(`${BASE_URL}`, user),

  /// POST /users/login
  /*
    data: {
      "email": "string",
      "password": "string"
    }
  */
  login: (user) => instance.post(`${BASE_URL}/login`, user),

  /// GET /users/{id}
  user: (id) => api.get(`${BASE_URL}/${id}`),
};

export default UsersService;
