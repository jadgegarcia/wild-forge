import axios from 'axios';
import apiConfig from './config';
import { api } from './axiosConfig';

/// TODO: change this if okay na
const BASE_URL = `${apiConfig.API_URL}/activity-comments`;

const ActivityCommentService = {
  /// POST /activity-comments
  /*
    data: {
        "user_id": 1,
        "activity_id": 1,
        "comment": "This is a test comment"
    }
    */
  addComment: (data) => api.post(`${BASE_URL}`, data),

  /// PUT /activity-comments/{id}
  /*
    data: {
        "user_id": 1,
        "activity_id": 1,
        "comment": "This is an updated test comment"
    }
    */
  updateComment: (id, data) => api.put(`${BASE_URL}/${id}`, data),

  /// DELETE /activity-comments/{id}
  deleteComment: (id) => api.delete(`${BASE_URL}/${id}`),

  /// GET /activity-comments/activities/{id}
  getAllCommentsForActivity: (id) => api.get(`${BASE_URL}/activities/${id}`),

  /// GET /activity-comments
  listAllCommentsForActivity: () => api.get(`${BASE_URL}`),

  /// GET/ activity-comments/{id}
  getComment: (id) => api.get(`${BASE_URL}/${id}`),
};

export default ActivityCommentService;
