import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../contexts/ToastContext';
import { updateProject, getWorkspaces } from '../../services/api';

const ICONS = ['📋', '🚀', '💻', '🎯', '⚡', '📱', '📊', '🛠️'];
const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
];

export default function EditProjectModal({ isOpen, onClose, project, onProjectUpdated }) {
  const { addToast } = useToast();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    progress: 0,
    icon: '📋',
    color: '#4f46e5',
    workspace_id: '',
    start_date: '',
    deadline: '',
  });

  useEffect(() => {
    if (isOpen) {
      getWorkspaces()
        .then(res => setWorkspaces(res.data))
        .catch(err => console.error('Failed to load workspaces for edit modal:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'active',
        progress: project.progress ?? 0,
        icon: project.icon || '📋',
        color: project.color || '#4f46e5',
        workspace_id: project.workspace_id || '',
        start_date: project.start_date ? String(project.start_date).slice(0, 10) : '',
        deadline: project.deadline ? String(project.deadline).slice(0, 10) : '',
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? Math.min(100, Math.max(0, parseInt(value, 10) || 0)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Project name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description ? formData.description.trim() : null,
        status: formData.status,
        progress: parseInt(formData.progress, 10) || 0,
        icon: formData.icon,
        color: formData.color,
      };

      if (formData.workspace_id) {
        payload.workspace_id = parseInt(formData.workspace_id, 10);
      }
      if (formData.start_date) {
        payload.start_date = formData.start_date;
      }
      if (formData.deadline) {
        payload.deadline = formData.deadline;
      }

      const res = await updateProject(project.id, payload);
      addToast('Project updated successfully', 'success');
      if (onProjectUpdated) {
        onProjectUpdated(res.data);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update project:', err);
      const errMsg = err.response?.data?.detail || 'Failed to update project';
      addToast(typeof errMsg === 'string' ? errMsg : 'Failed to update project', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-name" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="edit-name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input w-full text-sm"
            placeholder="e.g. Website Redesign"
          />
        </div>

        {workspaces.length > 0 && (
          <div>
            <label htmlFor="edit-workspace" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
              Workspace
            </label>
            <select
              id="edit-workspace"
              name="workspace_id"
              value={formData.workspace_id}
              onChange={handleChange}
              className="input w-full text-sm"
            >
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="edit-description" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
            Description
          </label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="input w-full text-sm resize-none h-20"
            placeholder="Brief overview of the project..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-status" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
              Status
            </label>
            <select
              id="edit-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input w-full text-sm"
            >
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-progress" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
              Progress ({formData.progress}%)
            </label>
            <input
              type="number"
              id="edit-progress"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className="input w-full text-sm"
            />
          </div>
        </div>

        {/* Icon & Color selector */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
              Project Icon
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {ICONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                  className={`text-lg p-2 rounded-lg border transition-all ${
                    formData.icon === emoji
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 scale-110'
                      : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
              Theme Color
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: c }))}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    formData.color === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn btn-ghost text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-sm inline-flex items-center gap-2"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
