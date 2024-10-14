import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/meetings`;

const MeetingsService = {
  /// GET /meetings
  all: (classroom_id, status) =>
    api.get(`${BASE_URL}?classroom=${classroom_id}&status=${status}`),

  /// POST /meetings
  /*
    data: {
      "classroom_id": "int",
      "owner_id": "int",
      "name": "string",
      "description": "string",
      "teacher_weight_score": "decimal",
      "student_weight_score": "decimal",
    }
  */
  create: (data) => api.post(BASE_URL, data),

  /// GET /meetings/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),

  start: (id) => api.post(`${BASE_URL}/${id}/start_meeting`, {}),
  join: (id) => api.post(`${BASE_URL}/${id}/join_meeting`, {}),
  end: (id) => api.post(`${BASE_URL}/${id}/end_meeting`, {}),

  // POST /meetings/{id}/presentors
  addMeetingPresentor: (id, data) =>
    api.post(`${BASE_URL}/${id}/add_presentor`, data),

  // POST /meetings/{id}/criterias
  addMeetingCriteria: (id, data) =>
    api.post(`${BASE_URL}/${id}/add_criteria`, data),

  // POST /meetings/{id}/comments
  addMeetingComment: (id, data) =>
    api.post(`${BASE_URL}/${id}/add_comment`, data),

  updateOpenPresentorRating: (id, data) =>
    api.post(`${BASE_URL}/${id}/open_rating_to_pitch`, data),

  addRatingToPresentor: (id, data) =>
    api.post(`${BASE_URL}/${id}/add_rating_to_pitch`, data),
  updateRatingToPresentor: (id, data) =>
    api.put(`${BASE_URL}/${id}/update_rating_to_pitch`, data),

  addRemarkToPresentor: (id, data) =>
    api.post(`${BASE_URL}/${id}/add_remark_to_pitch`, data),
  updateRemarkToPresentor: (id, data) =>
    api.put(`${BASE_URL}/${id}/update_remark_to_pitch`, data),

  addSummaryOfRemarksToPresentor: (id) =>
    api.post(`${BASE_URL}/${id}/summarize_presentors_remarks`, {}),

  getMeetingRatingHistory: (id) =>
    api.get(`${BASE_URL}/${id}/get_rating_history`),
  getMeetingRemarkHistory: (id) =>
    api.get(`${BASE_URL}/${id}/get_remark_history`),
  getMeetingFeedbackHistory: (id) =>
    api.get(`${BASE_URL}/${id}/get_feedback_history`),
};

export default MeetingsService;
