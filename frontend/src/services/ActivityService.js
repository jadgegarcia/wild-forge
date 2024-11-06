import axios from 'axios';
import apiConfig from './config';
import { api } from './axiosConfig';

const CLASS_BASE_URL = `${apiConfig.API_URL}/classes`;
const AWA_BASE_URL = `${apiConfig.API_URL}/activity-work-attachments`;

const ActivityService = {
  /// GET /classes/{class_id}/activities
  allActivities: (classId) => api.get(`${CLASS_BASE_URL}/${classId}/activities`),

  /// GET /classes/{class_id}/teams/{teamId}/activities/{activity_id}
  getActivity: (classId, teamId, activityId) =>
    api.get(`${CLASS_BASE_URL}/${classId}/teams/${teamId}/activities/${activityId}`),

  /// POST /classes/{class_id}/activities
  /*
    data: {
        "template_id": 1,
        "team_ids": [1, 2],
        "due_date": "2024-02-01T12:00:00Z",s
        "total_score": 100
    }
    */
  createActivity: (classId, data) => api.post(`${CLASS_BASE_URL}/${classId}/activities`, data),

  /// POST /classes/{class_id}/activities/from_template
  /*
    data: {
        "template_id": 1,
        "team_ids": [1, 2],
        "due_date": "2024-02-01T12:00:00Z",
        "total_score": 100
    }
    */
  createFromTemplate: (classId, data) =>
    api.post(`${CLASS_BASE_URL}/${classId}/activities/create_from_template`, data),

  /// POST /classes/${classId}/teams/${teamId}/activities/${activityId}/submit
  /*
    data: {
        "submission_status": true
    }
    */
  submitOrUnsubmit: (classId, teamId, activityId, data) =>
    api.post(`${CLASS_BASE_URL}/${classId}/teams/${teamId}/activities/${activityId}/submit`, {
      data,
    }),

  /// POST /classes/${classId}/teams/${teamId}/activities/${activityId}/add-evaluation
  /*
    data: {
        "evaluation": 80
    }
    */
  addEvaluation: (classId, teamId, activityId, data) =>
    api.post(
      `${CLASS_BASE_URL}/${classId}/teams/${teamId}/activities/${activityId}/add_evaluation`,
      data
    ),

  /// DELETE /classes/${classId}/teams/${teamId}/activities/${activityId}/delete-evaluation
  deleteEvaluation: (classId, teamId, activityId) =>
    api.delete(
      `${CLASS_BASE_URL}/${classId}/teams/${teamId}/activities/${activityId}/delete_evaluation`
    ),

  /// POST /activity-work-attachments
  /*
    data: {
        "activity_id": 1,
        "description": "Work attachment description",
        "file_attachment": "<please insert actual file path>" 
    }
    */
  addWorkAttachments: (data) => api.post(`${AWA_BASE_URL}`, data),

  /// PUT /activity-work-attachments/{id}
  /*
    data: {
        "activity_id": 1,
        "description": "Updated work attachment description",
        "file_attachment": "<please insert actual file path>" 
    }
    */
  updateWorkAttachments: (id, data) => api.put(`${AWA_BASE_URL}/${id}`, data),

  /// DELETE /activity-work-attachments/{id}
  deleteWorkAttachments: (id) => api.delete(`${AWA_BASE_URL}/${id}`),

  /// GET /activity-work-attachments/activities/{id}
  getAllWorkAttachmentsForActivity: (id) => api.get(`${AWA_BASE_URL}/activities/${id}`),
};

export default ActivityService;
