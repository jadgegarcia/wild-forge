import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/meeting_comments`;

const CommentsService = {
  all: (meetingId) => api.get(`${BASE_URL}/list_comments?meeting=${meetingId}`),
};

export default CommentsService;
