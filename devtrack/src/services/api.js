import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Health ─────────────────────────────────────────────────────────
export const checkHealth = () => api.get('/health');
export const checkDbHealth = () => api.get('/health/db');

// ─── Workspaces ─────────────────────────────────────────────────────
export const getWorkspaces = () => api.get('/workspaces');
export const getWorkspace = (id) => api.get(`/workspaces/${id}`);
export const createWorkspace = (data) => api.post('/workspaces', data);
export const updateWorkspace = (id, data) => api.put(`/workspaces/${id}`, data);
export const deleteWorkspace = (id) => api.delete(`/workspaces/${id}`);

// ─── Projects ───────────────────────────────────────────────────────
export const getProjects = (workspaceId) =>
  api.get('/projects', { params: { workspace_id: workspaceId } });
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// ─── Tasks ──────────────────────────────────────────────────────────
export const getTasks = (projectId) =>
  api.get('/tasks', { params: { project_id: projectId } });
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getComments = (taskId) => api.get(`/tasks/${taskId}/comments`);
export const createComment = (taskId, content) => api.post(`/tasks/${taskId}/comments`, { content });

// ─── Activities ─────────────────────────────────────────────────────
export const getActivities = (workspaceId, limit) =>
  api.get('/activities', { params: { workspace_id: workspaceId, limit } });

// ─── Members ────────────────────────────────────────────────────────
export const getMembers = (workspaceId) =>
  api.get('/members', { params: { workspace_id: workspaceId } });
export const inviteMember = (workspaceId, email, role) =>
  api.post('/members/invite', { workspace_id: workspaceId, email, role });
export const removeMember = (workspaceId, userId) =>
  api.delete(`/members/${userId}`, { params: { workspace_id: workspaceId } });
export const updateMemberRole = (workspaceId, userId, role) =>
  api.put(`/members/${userId}/role`, { workspace_id: workspaceId, role });

// ─── Analytics ──────────────────────────────────────────────────────
export const getAnalytics = (workspaceId, period) =>
  api.get('/analytics', { params: { workspace_id: workspaceId, period } });

// ─── Notifications ──────────────────────────────────────────────────
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}/read`);

export default api;
