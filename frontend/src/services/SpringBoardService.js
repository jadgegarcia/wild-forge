import axios from 'axios';
import apiConfig from './config';

const BASE_URL = `${apiConfig.API_URL}/spring`;

const api = axios.create({
  baseURL: BASE_URL,
  // Add any additional configuration here, such as headers or interceptors
});

const SpringBoardService = {
  getAllClassroomTeamAndProjects: () => api.get('/class_team_proj'),
  getTeamsAndProjectsByClassId: (classId) => api.get(`/class/${classId}/team_proj`),
  getProjectsByTeamId: (teamId) => api.get(`/team/${teamId}/projects`),
  getProjectsByUserId: (userId) => api.get(`/${userId}/projects`),
  allProject: () => api.get('/project'),
  getProjectById: (projId) => api.get(`/project/${projId}`),
  projectCreate: (data) => api.post('/project/create', data),
  projectUpdate: (projId, data) => api.put(`/project/${projId}/update`, data),
  deleteProject: (projId) => api.delete(`/project/${projId}/delete`),
  getProjectBoards: (projId) => api.get(`/project/${projId}/projectboards`),
  createProjectBoard: (projId, data) => api.post(`/project/${projId}/addprojectboards`, data),
  getProjectBoardById: (projbrdID) => api.get(`/projectboards/${projbrdID}`),
  updateBoard: (projbrdID, data) => api.post(`/projectboards/${projbrdID}/update`, data),
  deleteProjectBoard: (projbrdID) => api.delete(`/projectboards/${projbrdID}/delete`),
  getVersionProjectBoards: (projbrdID) => api.get(`/projectboards/${projbrdID}/versions`),
  getTemplate: (tempId) => api.get(`/template/${tempId}`),
  getAllTemplate: () => api.get('/template/'),
  createTemplate: (data) => api.post('/template/add', data),
  updateTemplate: (tempId, data) => api.patch(`/template/${tempId}/update`, data),
  deleteTemplate: (tempId) => api.delete(`/template/${tempId}/delete`),
};

export default SpringBoardService;
