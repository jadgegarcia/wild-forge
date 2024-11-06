import axios from 'axios';
import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/activity-templates`;

const ActivityTemplateService = {
  /// GET /activity-templates
  allActivityTemplates: () => api.get(`${BASE_URL}`),

  /// GET /activity-templates/{template_id}
  getActivityTemplate: (templateId) => api.get(`${BASE_URL}/${templateId}`),

  /// POST /activity-templates
  /*
	data: {
		"course_name": "Template 1",
		"title": "Template 1",
		"description": "This is a template",
	}
	*/
  createActivityTemplate: (data) => api.post(`${BASE_URL}`, data),

  /// PUT /activity-templates/{template_id}
  /*
	data: {
		"course_name": "Template 1",
		"title": "Template 1",
		"description": "This is a template",
	}
	*/
  updateActivityTemplate: (templateId, data) => api.put(`${BASE_URL}/${templateId}`, data),

  /// DELETE /activity-templates/{template_id}
  deleteActivityTemplate: (templateId) => api.delete(`${BASE_URL}/${templateId}`),

  /// GET /activity-templates/by_course
  // getAllActivityTemplateByCourse: () =>	api.get(`${BASE_URL}/by_course`)s

  /// GET /activity-templates/get_all_course
  getAllCourse: () => api.get(`${BASE_URL}/get_all_courses`),
};

export default ActivityTemplateService;
