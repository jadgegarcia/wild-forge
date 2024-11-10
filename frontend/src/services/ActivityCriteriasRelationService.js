import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/activity-criteria-relations`;

const ActivityCriteriasRelationService = {
  /// GET /activity-criteria-relations
  all: () => api.get(BASE_URL),

  /// POST /activity-criteria-relations
  /*
    data: {
      "activity": "integer",                // ID of the activity
      "activity_criteria": "integer",       // ID of the activity criteria
      "strictness": "integer",              // Your additional field
      "activity_criteria_status": "integer", // Status of the criteria
      "activity_criteria_feedback": "string" // Feedback string
    }
  */
  createActivityCriteriaRelation: (data) => api.post(BASE_URL, data),

  /// PUT /activity-criteria-relations/{relationId}
  /*
    data: {
      "strictness": "integer",
      "activity_criteria_status": "integer",
      "activity_criteria_feedback": "string"
    }
  */
//   updateActivityCriteriaRelation: (activityId, teamId, relationId, data) =>
    // api.put(`${BASE_URL}/${activityId}/teams/${teamId}/activities/${relationId}`, data),

  updateActivityCriteriaRelation: (id, data) => api.patch(`${BASE_URL}/${id}`, data),

  /// GET /activity-criteria-relations/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),

  /// DELETE /activity-criteria-relations/{id}
  delete: (id) => api.delete(`${BASE_URL}/${id}`),

  /// GET /activity-criteria-relations/by-activity-id/{activity_id}
  getByActivityId: (activity_id) => api.get(`${BASE_URL}/by-activity-id/${activity_id}`),

};

export default ActivityCriteriasRelationService;
