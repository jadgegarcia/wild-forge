import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/activity-criterias`;

const ActivityCriteriasService = {
  /// GET /activity-criterias
  all: () => api.get(BASE_URL),

  /// POST /activity-criterias
  /*
    data: {
      "name": "string",
      "description": "string",
    }
  */
 createActivityCriteria: (data) => api.post(BASE_URL, data),

 updateActivityCriteria: (data) =>
  api.put(`${BASE_URL}/${data.id}`, data),

  /// GET /activity-criterias/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),
};

export default ActivityCriteriasService;
