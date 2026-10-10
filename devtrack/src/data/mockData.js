/**
 * DEPRECATED: Mock business data has been removed from Orbit Flow.
 * All application pages and components now consume PostgreSQL-backed API endpoints exclusively.
 */

export const currentUser = {
  id: 'user-1',
  name: 'Tanushri',
  email: 'tanushri@devtrack.io',
  role: 'Owner',
  avatar: null,
  initials: 'T',
};

export const workspaces = [];
export const projects = [];
export const tasks = [];
export const users = [];
export const taskComments = {};
export const activities = [];
export const dashboardStats = {
  totalProjects: 0,
  totalTasks: 0,
  completedTasks: 0,
  overdueTasks: 0,
  completionRate: 0,
};
export const analyticsData = {
  totalProjects: 0,
  totalTasks: 0,
  completedTasks: 0,
  overdueTasks: 0,
  completionRate: 0,
  tasksByStatus: { todo: 0, inProgress: 0, inReview: 0, done: 0 },
  tasksByPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
  taskCompletionWeekly: [],
  teamWorkload: [],
  projectProgress: [],
};
export const notifications = [];

export const getUserById = (id) => null;
export const getWorkspaceById = (id) => null;
export const getProjectById = (id) => null;
export const getTasksByProject = (projectId) => [];
