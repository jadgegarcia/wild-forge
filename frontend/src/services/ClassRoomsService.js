import apiConfig from './config';
import { api } from './axiosConfig';

const BASE_URL = `${apiConfig.API_URL}/classes`;

const ClassRoomsService = {
  /// GET /classes
  all: () => api.get(BASE_URL),

  /// POST /classes
  /*
    data: {
      "course_name": "string",
      "sections": "string",
      "schedule": "string",
      "max_teams_members": 5
    }
  */
  create: (data) => api.post(BASE_URL, data),

  /// PUT /classes/{id}
  /*
    data: {
      "course_name": "string",
      "sections": "string",
      "schedule": "string",
      "max_teams_members": 5
    }
  */
  updateClass: (id, data) => api.put(`${BASE_URL}/${id}`, data),

  /// DELETE /classes/{id}
  deleteClass: (id) => api.delete(`${BASE_URL}/${id}`),

  /// POST /classes/join
  /*
    data: {
      "class_code": "string"
    }
  */
  join: (data) => api.post(`${BASE_URL}/join`, data),

  /// GET /classes/{id}
  get: (id) => api.get(`${BASE_URL}/${id}`),

  member: (classPK, userId) => api.get(`${BASE_URL}/${classPK}/members/${userId}`),

  /// GET /classes/{class_pk}/members/
  members: (classPK) => api.get(`${BASE_URL}/${classPK}/members`),

  // GET /classes/{class_pk}/members/{id}/teamrole
  classMemberTeam: (classPK, memberID) =>
    api.get(`${BASE_URL}/${classPK}/members/${memberID}/team`),

  /// PUT /classes/{class_pk}/members/{id}/accept
  accept: (classPK, memberID) => api.put(`${BASE_URL}/${classPK}/members/${memberID}/accept`),

  /// DELETE /classes/{class_pk}/members/{id}
  delete: (classPK, memberID) => api.delete(`${BASE_URL}/${classPK}/members/${memberID}`),

  /// PUT /classes/{class_pk}/members/{id}/acceptasleader
  acceptLeader: (classPK, memberID) =>
    api.put(`${BASE_URL}/${classPK}/members/${memberID}/acceptasleader`),

  /// DELETE /classes/{class_pk}/members/{id}/removeasleader
  removeLeader: (classPK, memberID) =>
    api.delete(`${BASE_URL}/${classPK}/members/${memberID}/removeasleader`),

  /// PUT /classes/{class_pk}/members/{id}/setleader
  setLeader: (classPK, memberID) => api.put(`${BASE_URL}/${classPK}/members/${memberID}/setleader`),

  /// GET /classes/{class_pk}/nonleaders
  nonleaders: (classPK) => api.get(`${BASE_URL}/${classPK}/nonleaders`),

  /// GET /classes/{class_pk}/leaders
  leaders: (classPK) => api.get(`${BASE_URL}/${classPK}/leaders`),

  /// GET /classes/{class_pk}/teams
  teams: (classPK) => api.get(`${BASE_URL}/${classPK}/teams`),
  myTeam: () => api.get(`${BASE_URL}/my_team`),
  /// POST /classes/{class_pk}/teams
  /*
    data: {
        "name": "string",
        "description": "string",
        "status": 1
      }
  */
  createTeam: (classPK, data) => api.post(`${BASE_URL}/${classPK}/teams`, data),

  /// GET /classes/{class_pk}/teams/{id}
  team: (classPK, teamID) => api.get(`${BASE_URL}/${classPK}/teams/${teamID}`),

  /// PUT /classes/{class_pk}/teams/{id}
  /*
    data: {
        "name": "string",
        "description": "string",
        "status": 1
      }
  */
  updateTeam: (classPK, teamID, data) => api.put(`${BASE_URL}/${classPK}/teams/${teamID}`, data),

  /// DELETE /classes/{class_pk}/teams/{id}
  deleteTeam: (classPK, teamID) => api.delete(`${BASE_URL}/${classPK}/teams/${teamID}`),

  /// PUT /classes/{class_pk}/teams/{id}/close
  closeTeams: (classPK, teamID) => api.put(`${BASE_URL}/${classPK}/teams/${teamID}/close`),

  /// PUT /classes/{class_pk}/teams/{id}/open
  openTeams: (classPK, teamID) => api.put(`${BASE_URL}/${classPK}/teams/${teamID}/open`),

  /// POST /classes/{class_pk}/teams/{id}/join
  joinTeam: (classPK, teamID) => api.post(`${BASE_URL}/${classPK}/teams/${teamID}/join`),

  /// GET /classes/{class_pk}/teams/{id}/members
  teamMembers: (classPK, teamID) => api.get(`${BASE_URL}/${classPK}/teams/${teamID}/members`),

  /// PUT /classes/{class_pk}/teams/{team_pk}/members/{id}/accept
  acceptTeamMember: (classPK, teamPK, memberID) =>
    api.put(`${BASE_URL}/${classPK}/teams/${teamPK}/members/${memberID}/accept`),

  /// DELETE /classes/{class_pk}/teams/{team_pk}/members/{id}/leave
  leaveTeam: (classPK, teamPK, memberID) =>
    api.delete(`${BASE_URL}/${classPK}/teams/${teamPK}/members/${memberID}/leave`),

  /// DELETE /classes/{class_pk}/teams/{team_pk}/members/{id}/remove
  removeTeamMember: (classPK, teamPK, memberID) =>
    api.delete(`${BASE_URL}/${classPK}/teams/${teamPK}/members/${memberID}/remove`),

  /// GET /classes/{id}/evals
  evals: (id) => api.get(`${BASE_URL}/${id}/evals`),
};

export default ClassRoomsService;
