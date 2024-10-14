import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/classes`;

const TeamService = {
  /// PUT /classes/{class_id}/activities
  /*
    data:{
        "classroom_id": 0,
        "team_id": [
            0
        ],
        "title": "string",
        "description": "string",
        "submission_status": true,
        "due_date": "2024-01-28T08:11:56.287Z",
        "evaluation": 2147483647,
        "total_score": 2147483647
    }
    */
  all: (classId) => api.get(`${BASE_URL}/${classId}/teams`),
  updateTeamActivity: (classId, teamId, activityId, data) =>
    api.put(`${BASE_URL}/${classId}/teams/${teamId}/activities/${activityId}`, data),

  /// DELETE /classes/{class_id}/activities
  deleteTeamActivity: (classId, teamId, activityId) =>
    api.delete(`${BASE_URL}/${classId}/teams/${teamId}/activities/${activityId}`),
};

export default TeamService;
