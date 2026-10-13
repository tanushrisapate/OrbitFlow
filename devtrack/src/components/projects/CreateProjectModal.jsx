import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../contexts/ToastContext';
import { createProject, getWorkspaces } from '../../services/api';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const { addToast } = useToast();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspace_id: '',
    startDate: '',
    deadline: '',
    status: 'active',
    color: '#4f46e5'
  });

  const colors = [
    { id: '#4f46e5', class: 'bg-indigo-500' },
    { id: '#8b5cf6', class: 'bg-purple-500' },
    { id: '#3b82f6', class: 'bg-blue-500' },
    { id: '#06b6d4', class: 'bg-cyan-500' },
    { id: '#10b981', class: 'bg-emerald-500' },
    { id: '#f59e0b', class: 'bg-amber-500' }
  ];

  useEffect(() => {
    if (isOpen) {
      getWorkspaces()
        .then(res => {
          setWorkspaces(res.data);
          if (res.data.length > 0 && !formData.workspace_id) {
            setFormData(prev => ({ ...prev, workspace_id: res.data[0].id }));
          }
        })
        .catch(err => console.error('Failed to load workspaces:', err));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (colorId) => {
    setFormData(prev => ({ ...prev, color: colorId }));
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
        workspace_id: parseInt(formData.workspace_id || 1, 10),
        status: formData.status.toLowerCase(),
        color: formData.color,
        icon: '📋',
        progress: 0
      };
      if (formData.startDate) payload.start_date = formData.startDate;
      if (formData.deadline) payload.deadline = formData.deadline;

      const res = await createProject(payload);
      addToast('Project created successfully', 'success');
      if (onProjectCreated) onProjectCreated(res.data);
      setFormData({
        name: '',
        description: '',
        workspace_id: workspaces[0]?.id || '',
        startDate: '',
        deadline: '',
        status: 'active',
        color: '#4f46e5'
      });
      onClose();
    } catch (err) {
      console.error('Failed to create project:', err);
      const errMsg = err.response?.data?.detail || 'Failed to create project';
      addToast(typeof errMsg === 'string' ? errMsg : 'Failed to create project', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
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
            <label htmlFor="workspace_id" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Workspace <span className="text-red-500">*</span>
            </label>
            <select
              id="workspace_id"
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
          <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="input w-full text-sm resize-none"
            placeholder="Brief description of the project..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input w-full text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Status
          </label>
          <select
            id="status"
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
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Project Color
          </label>
          <div className="flex items-center gap-3">
            {colors.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleColorSelect(c.id)}
                className={`w-8 h-8 rounded-full ${c.class} transition-all duration-200 ${
                  formData.color === c.id 
                    ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-surface-900 scale-110' 
                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                aria-label={`Select color`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800 mt-6">
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
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
