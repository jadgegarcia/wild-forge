import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/criterias`;

const CriteriasService = {
  /// GET /criterias
  all: () => api.get(BASE_URL),

  /// POST /criterias
  /*
    data: {
      "name": "string",
      "description": "string",
    }
  */
  create: (data) => api.post(BASE_URL, data),

  /// GET /classes/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),
};

export default CriteriasService;
