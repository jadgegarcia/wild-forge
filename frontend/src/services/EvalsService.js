import apiConfig from './config';

import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/evals`;

const EvalsService = {
  /// GET /evals
  all: () => api.get(BASE_URL),

  /// POST /evals
  /*
    data: {
      "name": "string",
      "forms_link": "string"
      "sheet_link": "string"
    }
  */
  create: (data) => api.post(BASE_URL, data),

  /// GET /evals/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),

  /// PUT /evals/{id}
  /*
    data: {
      "name": "string",
      "forms_link": "string"
      "sheet_link": "string"
    }
  */
  update: (id, data) => api.put(`${BASE_URL}/${id}`, data),

  /// DELETE /evals/{id}
  delete: (id) => api.delete(`${BASE_URL}/${id}`),

  /// POST /evals/{id}/assign
  /*
    data: {
      "class_id": "integer",
    }
  */
  assign: (id, data) => api.post(`${BASE_URL}/${id}/assign`, data),

  assigned: (class_id, cm_id) => api.get(`${BASE_URL}/assigned/${class_id}/classmember/${cm_id}`),
  submit_eval: (class_pe_id, cm_id) =>
    api.post(`${BASE_URL}/assigned/${class_pe_id}/classmember/${cm_id}/submit`),
};

export default EvalsService;
