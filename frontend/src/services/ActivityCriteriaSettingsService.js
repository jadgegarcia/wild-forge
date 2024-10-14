import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/activity-criteria-settings`;

const ActivityCriteriaSettingsService = {
  /// GET /activity-criteria-settings
  all: () => api.get(BASE_URL),

  /// POST /activity-criteria-settings
  /*
    data: {
      "api_key": "string"
    }
  */
  create: (data) => api.post(BASE_URL, data),

  /// PUT /activity-criteria-settings/{id}
  update: (id, data) => api.put(`${BASE_URL}/${id}`, data),
// update: (classId, teamId, settingsId, data) => api.put(`${BASE_URL}/${classId}/teams/${teamId}/activities/${settingsId}`, data),


//   updateWorkAttachments: (id, data) => api.put(`${AWA_BASE_URL}/${id}`, data),
//    update: (classId, teamId, settingsId, data) =>
//   api.put(`${BASE_URL}/${classId}/teams/${teamId}/activities/${settingsId}`, data),

  /// GET /activity-criteria-settings/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),
};

export default ActivityCriteriaSettingsService;
