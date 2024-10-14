const SIDENAV_DEFAULT = [
  { id: 1, label: 'Classes', className: 'classes', path: '/classes' },
];

const SIDENAV_MODERATOR = [
  { id: 1, label: 'Classes', className: 'classes', path: '/classes' },
  {
    id: 2,
    label: 'Peer Evaluation',
    className: 'peer-eval',
    path: '/peer-eval',
  },
  {
    id: 3,
    label: 'Project Reference',
    className: 'allprojects',
    path: '/allprojects',
  },
];

const SIDENAV_TEACHER = (classId) => [
  {
    id: 1,
    label: 'Dashboard',
    className: 'classes',
    path: `/classes/${classId}`,
  },
  {
    id: 2,
    label: 'Teams',
    className: 'teams',
    path: `/classes/${classId}/teams`,
  },
  {
    id: 3,
    label: 'Members',
    className: 'members',
    path: `/classes/${classId}/members`,
  },
  {
    id: 4,
    label: 'Activities',
    className: 'activities',
    path: `/classes/${classId}/activities`,
  },
  {
    id: 5,
    label: 'All Team Projects',
    className: 'allprojects',
    path: `/classes/${classId}/allteamprojects`,
  },
  {
    id: 6,
    label: 'Pitching & Validation',
    className: 'teknoplat',
    path: `/classes/${classId}/teknoplat`,
  },
];

const SIDENAV_CLASSMEMBER = (classId) => [
  {
    id: 1,
    label: 'Teams',
    className: 'teams',
    path: `/classes/${classId}/teams`,
  },
  {
    id: 2,
    label: 'Members',
    className: 'members',
    path: `/classes/${classId}/members`,
  },
  {
    id: 3,
    label: 'Peer Evals',
    className: 'peer-evals',
    path: `/classes/${classId}/evals`,
  },
  {
    id: 4,
    label: 'Activities',
    className: 'activities',
    path: `/classes/${classId}/activities`,
  },
  {
    id: 5,
    label: 'Projects',
    className: 'projects',
    path: `/classes/${classId}/projects`,
  },
  {
    id: 6,
    label: 'Project Reference',
    className: 'allprojects',
    path: `/classes/${classId}/allprojects`,
  },
  {
    id: 7,
    label: 'Teknoplat',
    className: 'teknoplat',
    path: `/classes/${classId}/teknoplat`,
  },
];

export {
  SIDENAV_DEFAULT,
  SIDENAV_TEACHER,
  SIDENAV_CLASSMEMBER,
  SIDENAV_MODERATOR,
};
